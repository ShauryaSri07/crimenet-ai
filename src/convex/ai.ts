import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

function extractJson(text: string): any {
  // Try to find JSON in the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) return JSON.parse(jsonMatch[1]);
  const directMatch = text.match(/\{[\s\S]*\}/);
  if (directMatch) return JSON.parse(directMatch[0]);
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) return JSON.parse(arrayMatch[0]);
  return null;
}

export const extractEntities = action({
  args: {
    text: v.string(),
    investigationId: v.id("investigations"),
    documentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const prompt = `Extract all entities from the following text. Return ONLY a JSON array of objects with these fields:
- entityType: one of "person", "organization", "location", "vehicle", "phone", "case", "event"
- name: the entity name
- alias: optional alias or alternate name
- description: brief description
- confidence: number between 0 and 1
- phone: phone number (for phone entities or persons)
- city: city name (for locations or persons)
- district: district (for locations)
- state: state (for locations)
- registrationNumber: vehicle registration (for vehicles)
- vehicleType: type of vehicle (for vehicles)
- vehicleMake: make/model (for vehicles)
- organizationType: type (for organizations)
- firNumber: FIR number (for cases)
- policeStation: police station (for cases)
- sections: legal sections (for cases)
- eventLocation: location of event (for events)

Text:
${args.text}

Return ONLY the JSON array, no explanation.`;

    const response = await callGemini(prompt);
    if (!response) {
      return {
        success: false,
        error:
          "AI processing is currently unavailable. The uploaded data has been saved and can be processed again.",
        entities: [],
      };
    }

    try {
      const parsed = extractJson(response);
      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: "Invalid AI response format",
          entities: [],
        };
      }

      const validEntities = parsed
        .filter(
          (e: any) =>
            e.entityType &&
            e.name &&
            [
              "person",
              "organization",
              "location",
              "vehicle",
              "phone",
              "case",
              "event",
            ].includes(e.entityType)
        )
        .map((e: any) => ({
          entityType: e.entityType,
          name: e.name,
          alias: e.alias || undefined,
          description: e.description || undefined,
          confidence: Math.min(1, Math.max(0, e.confidence || 0.5)),
          investigationId: args.investigationId,
          documentId: args.documentId,
          phone: e.phone || undefined,
          city: e.city || undefined,
          district: e.district || undefined,
          state: e.state || undefined,
          registrationNumber: e.registrationNumber || undefined,
          vehicleType: e.vehicleType || undefined,
          vehicleMake: e.vehicleMake || undefined,
          organizationType: e.organizationType || undefined,
          firNumber: e.firNumber || undefined,
          policeStation: e.policeStation || undefined,
          sections: e.sections || undefined,
          eventLocation: e.eventLocation || undefined,
        }));

      return { success: true, entities: validEntities, error: null };
    } catch {
      return {
        success: false,
        error: "Failed to parse AI response",
        entities: [],
      };
    }
  },
});

export const extractRelationships = action({
  args: {
    text: v.string(),
    entityIds: v.array(v.id("entities")),
    investigationId: v.id("investigations"),
    documentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    // Get entity details for context
    const entityDetails: Array<{ id: string; name: string; type: string }> = [];
    for (const eid of args.entityIds) {
      const entity = await ctx.runQuery(
        ("./entities" as any).get,
        { id: eid }
      );
      if (entity) {
        entityDetails.push({
          id: entity._id,
          name: entity.name,
          type: entity.entityType,
        });
      }
    }

    const entityList = entityDetails
      .map((e) => `- ${e.name} (${e.type}, id: ${e.id})`)
      .join("\n");

    const prompt = `Based on the following text and entities, extract relationships between the entities.
Return ONLY a JSON array of objects with these fields:
- sourceId: the id of the source entity
- targetId: the id of the target entity
- relationshipType: one of "communicated_with", "associated_with", "uses", "owns", "visited", "involved_in", "participated_in", "operates_in", "occurred_at", "connected_to"
- confidence: number between 0 and 1

Only create relationships that are supported by the text. Do not invent relationships.

Text:
${args.text}

Known Entities:
${entityList}

Return ONLY the JSON array, no explanation.`;

    const response = await callGemini(prompt);
    if (!response) {
      return {
        success: false,
        error:
          "AI processing is currently unavailable. The data has been saved and can be processed again.",
        relationships: [],
      };
    }

    try {
      const parsed = extractJson(response);
      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: "Invalid AI response format",
          relationships: [],
        };
      }

      const validEntityIds = new Set(entityDetails.map((e) => e.id));
      const validRelationships = parsed
        .filter(
          (r: any) =>
            r.sourceId &&
            r.targetId &&
            r.relationshipType &&
            validEntityIds.has(r.sourceId) &&
            validEntityIds.has(r.targetId) &&
            r.sourceId !== r.targetId
        )
        .map((r: any) => ({
          sourceId: r.sourceId,
          targetId: r.targetId,
          relationshipType: r.relationshipType,
          confidence: Math.min(1, Math.max(0, r.confidence || 0.5)),
          investigationId: args.investigationId,
          documentId: args.documentId,
        }));

      return {
        success: true,
        relationships: validRelationships,
        error: null,
      };
    } catch {
      return {
        success: false,
        error: "Failed to parse AI response",
        relationships: [],
      };
    }
  },
});

export const generateInsight = action({
  args: {
    investigationId: v.id("investigations"),
    context: v.string(),
    question: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `You are an AI crime analysis assistant for UP Police. Based on the following investigation data, provide analytical insights. Always clearly distinguish between verified database information and AI-generated interpretation. If data is insufficient, state "Insufficient data available in the investigation database."

${args.question ? `Question: ${args.question}` : ""}

Investigation Data:
${args.context}

Provide a structured analysis. Label your response with "AI-GENERATED ANALYSIS".`;

    const response = await callGemini(prompt);
    if (!response) {
      return {
        success: false,
        error:
          "AI processing is currently unavailable. The data has been saved and can be processed again.",
        insight: null,
      };
    }

    const userId = await getAuthUserId(ctx);
    if (userId) {
      await ctx.runMutation(
        ("./insights" as any).create,
        {
          insightType: args.question ? "chat_response" : "auto_insight",
          content: response,
          investigationId: args.investigationId,
          userId,
        }
      );
    }

    return { success: true, insight: response, error: null };
  },
});

export const generateSummary = action({
  args: {
    investigationId: v.id("investigations"),
    context: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `You are an AI crime analysis assistant for UP Police. Generate a comprehensive investigation summary report based on the following structured data.

Include these sections:
1. Executive Summary
2. Key Entities
3. Network Structure
4. Suspicious Patterns
5. Important Locations
6. Important Relationships
7. Analytical Leads

Clearly distinguish verified database information from AI-generated interpretation.
Label your response "AI-GENERATED INVESTIGATION SUMMARY".

Data:
${args.context}`;

    const response = await callGemini(prompt);
    if (!response) {
      return {
        success: false,
        error:
          "AI processing is currently unavailable. Please try again later.",
        summary: null,
      };
    }

    const userId = await getAuthUserId(ctx);
    if (userId) {
      await ctx.runMutation(
        ("./insights" as any).create,
        {
          insightType: "investigation_summary",
          content: response,
          investigationId: args.investigationId,
          userId,
        }
      );
    }

    return { success: true, summary: response, error: null };
  },
});

export const checkAvailability = action({
  args: {},
  handler: async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return false;
    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say OK" }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
});
