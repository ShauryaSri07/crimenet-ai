import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Clear all data
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Delete all data in order (respecting foreign keys)
    const collections = [
      "auditLogs",
      "aiInsights",
      "patterns",
      "networkMetrics",
      "relationships",
      "entities",
      "documents",
      "investigations",
    ] as const;

    for (const collection of collections) {
      const docs = await ctx.db.query(collection).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }
    return true;
  },
});

// Load comprehensive synthetic demo dataset
export const loadDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const now = Date.now();

    // Create demo investigation
    const invId = await ctx.db.insert("investigations", {
      title: "Operation Black Net — Interstate Smuggling Network",
      description:
        "Investigation into a criminal network operating across Lucknow, Kanpur, Noida, and Varanasi. Involves drug trafficking, money laundering, and organized crime. SYNTHETIC DEMO DATA — FOR DEMONSTRATION ONLY.",
      status: "under_investigation",
      priority: "high",
      userId,
      createdAt: now - 30 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    // Create a document
    const docId = await ctx.db.insert("documents", {
      title: "Intelligence Report — Op Black Net",
      content:
        "Amit Verma was observed communicating with Raj Malhotra using a phone number +91-9876543210. Raj has connections with XYZ Logistics and was repeatedly seen in Lucknow and Kanpur. Sanjay Mishra controls the Noida cell with help from Deepak Yadav. Vehicles UP32AB1234 and UP65CD5678 were used for transport.",
      fileType: "text",
      investigationId: invId,
      userId,
      processed: true,
      createdAt: now - 25 * 24 * 60 * 60 * 1000,
    });

    const doc2Id = await ctx.db.insert("documents", {
      title: "Surveillance Report — Varanasi Operations",
      content:
        "Surveillance indicates Ravi Tiwari meeting with Priya Verma at Lucknow Real Estate Group office. Pooja Gupta was seen with Arjun Patel in Kanpur. Nisha Saxena used phone +91-8877665544 for communications. Mohan Lal drove UP14EF9012 for deliveries.",
      fileType: "text",
      investigationId: invId,
      userId,
      processed: true,
      createdAt: now - 20 * 24 * 60 * 60 * 1000,
    });

    // === PERSONS ===
    const persons = [
      {
        name: "Vikram Singh",
        alias: "Vicky",
        description: "Key criminal, network leader",
        phone: "+91-9876543210",
        city: "Lucknow",
      },
      {
        name: "Rajesh Kumar",
        alias: "Raju",
        description: "Senior associate, logistics coordinator",
        phone: "+91-9123456789",
        city: "Kanpur",
      },
      {
        name: "Amit Sharma",
        alias: undefined,
        description: "Intermediary, connects multiple cells",
        phone: "+91-9988776655",
        city: "Noida",
      },
      {
        name: "Sanjay Mishra",
        alias: "Sanju",
        description: "Noida cell controller",
        phone: "+91-8877665544",
        city: "Noida",
      },
      {
        name: "Deepak Yadav",
        alias: "DP",
        description: "Enforcer, associate of Sanjay",
        phone: "+91-7766554433",
        city: "Noida",
      },
      {
        name: "Ravi Tiwari",
        alias: undefined,
        description: "Financier, money laundering",
        phone: "+91-6655443322",
        city: "Lucknow",
      },
      {
        name: "Priya Verma",
        alias: undefined,
        description: "Real estate agent, front operations",
        phone: "+91-5544332211",
        city: "Lucknow",
      },
      {
        name: "Mohan Lal",
        alias: "Driver Mohan",
        description: "Driver and transporter",
        phone: "+91-4433221100",
        city: "Kanpur",
      },
      {
        name: "Pooja Gupta",
        alias: undefined,
        description: "Associate, Kanpur operations",
        phone: "+91-3322110099",
        city: "Kanpur",
      },
      {
        name: "Arjun Patel",
        alias: undefined,
        description: "Local contact, Kanpur",
        phone: "+91-2211009988",
        city: "Kanpur",
      },
      {
        name: "Nisha Saxena",
        alias: undefined,
        description: "Communications coordinator",
        phone: "+91-1100998877",
        city: "Varanasi",
      },
      {
        name: "Sunita Devi",
        alias: undefined,
        description: "Associate, Varanasi operations",
        phone: "+91-0099887766",
        city: "Varanasi",
      },
    ];

    const personIds: string[] = [];
    for (const p of persons) {
      const id = await ctx.db.insert("entities", {
        entityType: "person",
        name: p.name,
        alias: p.alias,
        description: p.description,
        confidence: 0.75 + Math.random() * 0.2,
        investigationId: invId,
        documentId: docId,
        phone: p.phone,
        city: p.city,
        createdAt: now - 25 * 24 * 60 * 60 * 1000,
      });
      personIds.push(id);
    }

    // === ORGANIZATIONS ===
    const orgs = [
      { name: "XYZ Logistics", organizationType: "Transportation" },
      { name: "Sharma Trading Co.", organizationType: "Trading Front" },
      { name: "Delhi Transport Union", organizationType: "Transport Union" },
      { name: "Kanpur Steel Works", organizationType: "Manufacturing" },
      { name: "Lucknow Real Estate Group", organizationType: "Real Estate" },
    ];

    const orgIds: string[] = [];
    for (const o of orgs) {
      const id = await ctx.db.insert("entities", {
        entityType: "organization",
        name: o.name,
        organizationType: o.organizationType,
        confidence: 0.8,
        investigationId: invId,
        documentId: docId,
        createdAt: now - 24 * 24 * 60 * 60 * 1000,
      });
      orgIds.push(id);
    }

    // === LOCATIONS ===
    const locs = [
      { name: "Lucknow", city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh" },
      { name: "Kanpur", city: "Kanpur", district: "Kanpur Nagar", state: "Uttar Pradesh" },
      { name: "Noida", city: "Noida", district: "Gautam Buddh Nagar", state: "Uttar Pradesh" },
      { name: "Varanasi", city: "Varanasi", district: "Varanasi", state: "Uttar Pradesh" },
      { name: "Agra", city: "Agra", district: "Agra", state: "Uttar Pradesh" },
      { name: "Prayagraj", city: "Prayagraj", district: "Prayagraj", state: "Uttar Pradesh" },
      { name: "Meerut", city: "Meerut", district: "Meerut", state: "Uttar Pradesh" },
      { name: "Gorakhpur", city: "Gorakhpur", district: "Gorakhpur", state: "Uttar Pradesh" },
    ];

    const locIds: string[] = [];
    for (const l of locs) {
      const id = await ctx.db.insert("entities", {
        entityType: "location",
        name: l.name,
        city: l.city,
        district: l.district,
        state: l.state,
        confidence: 0.95,
        investigationId: invId,
        createdAt: now - 23 * 24 * 60 * 60 * 1000,
      });
      locIds.push(id);
    }

    // === VEHICLES ===
    const vehicles = [
      { name: "UP32AB1234", registrationNumber: "UP32AB1234", vehicleType: "SUV", vehicleMake: "Toyota Innova" },
      { name: "UP65CD5678", registrationNumber: "UP65CD5678", vehicleType: "SUV", vehicleMake: "Mahindra Scorpio" },
      { name: "UP14EF9012", registrationNumber: "UP14EF9012", vehicleType: "Sedan", vehicleMake: "Maruti Swift" },
      { name: "UP32GH3456", registrationNumber: "UP32GH3456", vehicleType: "Sedan", vehicleMake: "Honda City" },
    ];

    const vehicleIds: string[] = [];
    for (const v of vehicles) {
      const id = await ctx.db.insert("entities", {
        entityType: "vehicle",
        name: v.name,
        registrationNumber: v.registrationNumber,
        vehicleType: v.vehicleType,
        vehicleMake: v.vehicleMake,
        confidence: 0.85,
        investigationId: invId,
        documentId: docId,
        createdAt: now - 22 * 24 * 60 * 60 * 1000,
      });
      vehicleIds.push(id);
    }

    // === PHONES ===
    const phones = [
      "+91-9876543210",
      "+91-9123456789",
      "+91-9988776655",
      "+91-8877665544",
      "+91-7766554433",
    ];

    const phoneIds: string[] = [];
    for (const p of phones) {
      const id = await ctx.db.insert("entities", {
        entityType: "phone",
        name: p,
        phone: p,
        confidence: 0.9,
        investigationId: invId,
        documentId: docId,
        createdAt: now - 21 * 24 * 60 * 60 * 1000,
      });
      phoneIds.push(id);
    }

    // === CASES ===
    const casesData = [
      {
        name: "FIR/2024/001234",
        firNumber: "FIR/2024/001234",
        policeStation: "Hazratganj PS, Lucknow",
        sections: "IPC 302, 307, 120B, NDPS Act 20",
        description: "Drug trafficking and criminal conspiracy",
        caseDate: now - 60 * 24 * 60 * 60 * 1000,
      },
      {
        name: "FIR/2024/005678",
        firNumber: "FIR/2024/005678",
        policeStation: "Kotwali, Kanpur",
        sections: "IPC 420, 467, 468, 120B",
        description: "Money laundering and fraud",
        caseDate: now - 45 * 24 * 60 * 60 * 1000,
      },
      {
        name: "FIR/2024/009012",
        firNumber: "FIR/2024/009012",
        policeStation: "Sector 20 PS, Noida",
        sections: "IPC 395, 397, 120B",
        description: "Armed robbery and organized crime",
        caseDate: now - 30 * 24 * 60 * 60 * 1000,
      },
    ];

    const caseIds: string[] = [];
    for (const c of casesData) {
      const id = await ctx.db.insert("entities", {
        entityType: "case",
        name: c.name,
        firNumber: c.firNumber,
        policeStation: c.policeStation,
        sections: c.sections,
        description: c.description,
        caseDate: c.caseDate,
        confidence: 0.95,
        investigationId: invId,
        createdAt: now - 20 * 24 * 60 * 60 * 1000,
      });
      caseIds.push(id);
    }

    // === EVENTS ===
    const eventsData = [
      {
        name: "Meeting at Lucknow Safe House",
        eventDate: now - 55 * 24 * 60 * 60 * 1000,
        eventLocation: "Safe House, Aliganj, Lucknow",
        description: "Strategic meeting of network leaders",
      },
      {
        name: "Shipment Transfer at Kanpur",
        eventDate: now - 40 * 24 * 60 * 60 * 1000,
        eventLocation: "Kanpur Steel Works Yard",
        description: "Large shipment transfer operation",
      },
      {
        name: "Cash Transfer at Noida",
        eventDate: now - 25 * 24 * 60 * 60 * 1000,
        eventLocation: "Sector 62, Noida",
        description: "Cash handoff between cells",
      },
      {
        name: "Planning Meeting at Varanasi",
        eventDate: now - 15 * 24 * 60 * 60 * 1000,
        eventLocation: "Assi Ghat, Varanasi",
        description: "Planning for new operations",
      },
    ];

    const eventIds: string[] = [];
    for (const e of eventsData) {
      const id = await ctx.db.insert("entities", {
        entityType: "event",
        name: e.name,
        eventDate: e.eventDate,
        eventLocation: e.eventLocation,
        description: e.description,
        confidence: 0.7,
        investigationId: invId,
        createdAt: now - 15 * 24 * 60 * 60 * 1000,
      });
      eventIds.push(id);
    }

    // === RELATIONSHIPS ===
    const rels: Array<{
      srcIdx: number;
      srcType: string;
      tgtIdx: number;
      tgtType: string;
      relType: string;
      conf: number;
    }> = [
      // Person-Person
      { srcIdx: 0, srcType: "person", tgtIdx: 1, tgtType: "person", relType: "communicated_with", conf: 0.92 },
      { srcIdx: 0, srcType: "person", tgtIdx: 2, tgtType: "person", relType: "communicated_with", conf: 0.85 },
      { srcIdx: 0, srcType: "person", tgtIdx: 3, tgtType: "person", relType: "associated_with", conf: 0.88 },
      { srcIdx: 1, srcType: "person", tgtIdx: 2, tgtType: "person", relType: "communicated_with", conf: 0.82 },
      { srcIdx: 3, srcType: "person", tgtIdx: 4, tgtType: "person", relType: "associated_with", conf: 0.90 },
      { srcIdx: 5, srcType: "person", tgtIdx: 6, tgtType: "person", relType: "communicated_with", conf: 0.78 },
      { srcIdx: 1, srcType: "person", tgtIdx: 8, tgtType: "person", relType: "associated_with", conf: 0.75 },
      { srcIdx: 8, srcType: "person", tgtIdx: 9, tgtType: "person", relType: "communicated_with", conf: 0.80 },
      { srcIdx: 10, srcType: "person", tgtIdx: 11, tgtType: "person", relType: "associated_with", conf: 0.72 },
      { srcIdx: 0, srcType: "person", tgtIdx: 7, tgtType: "person", relType: "associated_with", conf: 0.70 },
      { srcIdx: 5, srcType: "person", tgtIdx: 10, tgtType: "person", relType: "communicated_with", conf: 0.68 },
      { srcIdx: 6, srcType: "person", tgtIdx: 5, tgtType: "person", relType: "connected_to", conf: 0.65 },
      // Person-Org
      { srcIdx: 0, srcType: "person", tgtIdx: 0, tgtType: "org", relType: "associated_with", conf: 0.88 },
      { srcIdx: 1, srcType: "person", tgtIdx: 0, tgtType: "org", relType: "associated_with", conf: 0.82 },
      { srcIdx: 2, srcType: "person", tgtIdx: 1, tgtType: "org", relType: "associated_with", conf: 0.75 },
      { srcIdx: 3, srcType: "person", tgtIdx: 3, tgtType: "org", relType: "associated_with", conf: 0.80 },
      { srcIdx: 6, srcType: "person", tgtIdx: 4, tgtType: "org", relType: "associated_with", conf: 0.85 },
      { srcIdx: 0, srcType: "person", tgtIdx: 2, tgtType: "org", relType: "associated_with", conf: 0.60 },
      // Person-Phone
      { srcIdx: 0, srcType: "person", tgtIdx: 0, tgtType: "phone", relType: "uses", conf: 0.95 },
      { srcIdx: 1, srcType: "person", tgtIdx: 1, tgtType: "phone", relType: "uses", conf: 0.93 },
      { srcIdx: 2, srcType: "person", tgtIdx: 2, tgtType: "phone", relType: "uses", conf: 0.90 },
      { srcIdx: 3, srcType: "person", tgtIdx: 3, tgtType: "phone", relType: "uses", conf: 0.92 },
      { srcIdx: 4, srcType: "person", tgtIdx: 4, tgtType: "phone", relType: "uses", conf: 0.88 },
      // Person-Vehicle
      { srcIdx: 0, srcType: "person", tgtIdx: 0, tgtType: "vehicle", relType: "owns", conf: 0.85 },
      { srcIdx: 1, srcType: "person", tgtIdx: 1, tgtType: "vehicle", relType: "owns", conf: 0.80 },
      { srcIdx: 7, srcType: "person", tgtIdx: 2, tgtType: "vehicle", relType: "uses", conf: 0.78 },
      { srcIdx: 3, srcType: "person", tgtIdx: 3, tgtType: "vehicle", relType: "uses", conf: 0.72 },
      // Person-Location
      { srcIdx: 0, srcType: "person", tgtIdx: 0, tgtType: "loc", relType: "visited", conf: 0.90 },
      { srcIdx: 1, srcType: "person", tgtIdx: 1, tgtType: "loc", relType: "visited", conf: 0.88 },
      { srcIdx: 3, srcType: "person", tgtIdx: 2, tgtType: "loc", relType: "visited", conf: 0.85 },
      { srcIdx: 10, srcType: "person", tgtIdx: 3, tgtType: "loc", relType: "visited", conf: 0.82 },
      { srcIdx: 1, srcType: "person", tgtIdx: 0, tgtType: "loc", relType: "visited", conf: 0.75 },
      { srcIdx: 0, srcType: "person", tgtIdx: 2, tgtType: "loc", relType: "visited", conf: 0.70 },
      // Person-Case
      { srcIdx: 0, srcType: "person", tgtIdx: 0, tgtType: "case", relType: "involved_in", conf: 0.90 },
      { srcIdx: 1, srcType: "person", tgtIdx: 0, tgtType: "case", relType: "involved_in", conf: 0.85 },
      { srcIdx: 2, srcType: "person", tgtIdx: 1, tgtType: "case", relType: "involved_in", conf: 0.80 },
      { srcIdx: 3, srcType: "person", tgtIdx: 2, tgtType: "case", relType: "involved_in", conf: 0.82 },
      { srcIdx: 4, srcType: "person", tgtIdx: 2, tgtType: "case", relType: "involved_in", conf: 0.78 },
      // Person-Event
      { srcIdx: 0, srcType: "person", tgtIdx: 0, tgtType: "event", relType: "participated_in", conf: 0.88 },
      { srcIdx: 1, srcType: "person", tgtIdx: 0, tgtType: "event", relType: "participated_in", conf: 0.85 },
      { srcIdx: 5, srcType: "person", tgtIdx: 2, tgtType: "event", relType: "participated_in", conf: 0.80 },
      { srcIdx: 6, srcType: "person", tgtIdx: 2, tgtType: "event", relType: "participated_in", conf: 0.75 },
      { srcIdx: 0, srcType: "person", tgtIdx: 3, tgtType: "event", relType: "participated_in", conf: 0.72 },
      // Org-Location
      { srcIdx: 0, srcType: "org", tgtIdx: 0, tgtType: "loc", relType: "operates_in", conf: 0.90 },
      { srcIdx: 1, srcType: "org", tgtIdx: 1, tgtType: "loc", relType: "operates_in", conf: 0.85 },
      { srcIdx: 3, srcType: "org", tgtIdx: 1, tgtType: "loc", relType: "operates_in", conf: 0.80 },
      { srcIdx: 4, srcType: "org", tgtIdx: 0, tgtType: "loc", relType: "operates_in", conf: 0.88 },
      // Case-Location
      { srcIdx: 0, srcType: "case", tgtIdx: 0, tgtType: "loc", relType: "occurred_at", conf: 0.95 },
      { srcIdx: 1, srcType: "case", tgtIdx: 1, tgtType: "loc", relType: "occurred_at", conf: 0.92 },
      { srcIdx: 2, srcType: "case", tgtIdx: 2, tgtType: "loc", relType: "occurred_at", conf: 0.90 },
    ];

    // Map indices to actual IDs
    const getTypeArray = (type: string, idx: number) => {
      switch (type) {
        case "person": return personIds[idx];
        case "org": return orgIds[idx];
        case "loc": return locIds[idx];
        case "vehicle": return vehicleIds[idx];
        case "phone": return phoneIds[idx];
        case "case": return caseIds[idx];
        case "event": return eventIds[idx];
        default: return personIds[0];
      }
    };

    for (const r of rels) {
      await ctx.db.insert("relationships", {
        sourceId: getTypeArray(r.srcType, r.srcIdx) as any,
        targetId: getTypeArray(r.tgtType, r.tgtIdx) as any,
        relationshipType: r.relType,
        confidence: r.conf,
        investigationId: invId,
        documentId: docId,
        createdAt: now - 20 * 24 * 60 * 60 * 1000,
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      action: "demo_data_loaded",
      entityType: "system",
      details: "SYNTHETIC DEMO DATA loaded: 12 persons, 5 organizations, 8 locations, 4 vehicles, 5 phones, 3 cases, 4 events, 48 relationships",
      userId,
      createdAt: now,
    });

    return {
      investigationId: invId,
      entities: persons.length + orgs.length + locs.length + vehicles.length + phones.length + casesData.length + eventsData.length,
      relationships: rels.length,
    };
  },
});

export const isLoaded = query({
  args: {},
  handler: async (ctx) => {
    const entities = await ctx.db.query("entities").first();
    return entities !== null;
  },
});
