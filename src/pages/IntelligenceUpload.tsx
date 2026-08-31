import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/AppLayout";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntelligenceUploadPage() {
  const investigations = useQuery(api.investigations.list);
  const createDocument = useMutation(api.documents.create);
  const markProcessed = useMutation(api.documents.markProcessed);
  const createEntities = useMutation(api.entities.createMany);
  const createRelationships = useMutation(api.relationships.createMany);

  const extractEntities = useAction(api.ai.extractEntities);
  const extractRelationships = useAction(api.ai.extractRelationships);

  const [selectedInvestigation, setSelectedInvestigation] = useState("");
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");
  const [entityCount, setEntityCount] = useState(0);
  const [relCount, setRelCount] = useState(0);

  const EXAMPLE_TEXT = `Amit Verma was observed communicating with Raj Malhotra using a phone number +91-9876543210. Raj has connections with XYZ Logistics and was repeatedly seen in Lucknow and Kanpur. Sanjay Mishra controls the Noida cell with help from Deepak Yadav. Vehicles UP32AB1234 and UP65CD5678 were used for transport operations. A meeting was held at Sector 62, Noida on February 20, 2024 between Ravi Tiwari and Priya Verma at the Lucknow Real Estate Group office. FIR/2024/001234 was registered at Hazratganj PS, Lucknow under IPC 302, 307, 120B and NDPS Act 20.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestigation || !textInput.trim()) return;

    setStatus("processing");
    setResult("");
    setEntityCount(0);
    setRelCount(0);

    try {
      // Create document record
      const docId = await createDocument({
        title: `Intelligence Report — ${new Date().toLocaleDateString("en-IN")}`,
        content: textInput,
        fileType: "text",
        investigationId: selectedInvestigation as any,
      });

      // Extract entities
      const entityResult = await extractEntities({
        text: textInput,
        investigationId: selectedInvestigation as any,
        documentId: docId,
      });

      if (!entityResult.success) {
        setStatus("error");
        setResult(entityResult.error || "Failed to extract entities");
        return;
      }

      // Store entities
      const entityIds = await createEntities({
        entities: entityResult.entities.map((e: any) => ({
          ...e,
          investigationId: selectedInvestigation as any,
          documentId: docId,
        })),
      });

      setEntityCount(entityIds.length);

      // Extract relationships
      const relResult = await extractRelationships({
        text: textInput,
        entityIds: entityIds as any,
        investigationId: selectedInvestigation as any,
        documentId: docId,
      });

      if (relResult.success && relResult.relationships.length > 0) {
        await createRelationships({
          relationships: relResult.relationships.map((r: any) => ({
            ...r,
            investigationId: selectedInvestigation as any,
            documentId: docId,
          })),
        });
        setRelCount(relResult.relationships.length);
      }

      await markProcessed({ id: docId });
      setStatus("done");
      setResult(
        `Successfully processed document. Extracted ${entityIds.length} entities and ${relResult.relationships.length} relationships.`
      );
    } catch (err) {
      setStatus("error");
      setResult(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence Upload</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload intelligence documents or enter text for AI-powered analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Investigation selector */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Select Investigation
            </label>
            <select
              value={selectedInvestigation}
              onChange={(e) => setSelectedInvestigation(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40"
              required
            >
              <option value="">Select an investigation...</option>
              {investigations?.map((inv) => (
                <option key={inv._id} value={inv._id}>
                  {inv.title}
                </option>
              ))}
            </select>
          </div>

          {/* Text input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">
                Intelligence Text / Report
              </label>
              <button
                type="button"
                onClick={() => setTextInput(EXAMPLE_TEXT)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Load example
              </button>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-48 px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40 resize-none font-mono"
              placeholder="Paste FIR text, police report, surveillance report, or investigation notes here..."
              required
            />
          </div>

          {/* File upload zone (visual only for text processing) */}
          <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-white/[0.12] transition-colors">
            <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Supported formats: PDF, TXT, CSV, JSON, DOCX
            </p>
            <p className="text-[11px] text-gray-600 mt-1">
              Text extraction happens server-side. Paste text above for quick analysis.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedInvestigation || !textInput.trim() || status === "processing"}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "processing" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Analyze with AI
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div
            className={cn(
              "rounded-xl p-5 border",
              status === "done"
                ? "bg-green-500/5 border-green-500/15"
                : "bg-red-500/5 border-red-500/15"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {status === "done" ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  status === "done" ? "text-green-400" : "text-red-400"
                )}
              >
                {status === "done" ? "Processing Complete" : "Error"}
              </span>
            </div>
            <p className="text-sm text-gray-300">{result}</p>
            {status === "done" && (
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span>Entities: {entityCount}</span>
                <span>Relationships: {relCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
