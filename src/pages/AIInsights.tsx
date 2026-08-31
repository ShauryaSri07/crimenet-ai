import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/AppLayout";
import { Brain, Loader2, Send, AlertCircle } from "lucide-react";

export default function AIInsightsPage() {
  const [selectedInvestigation, setSelectedInvestigation] = useState("");
  const [question, setQuestion] = useState("");
  const investigations = useQuery(api.investigations.list);
  const insights = useQuery(
    api.insights.list,
    selectedInvestigation
      ? { investigationId: selectedInvestigation as any }
      : "skip"
  );
  const generateInsight = useAction(api.ai.generateInsight);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const questions = [
    "Who are the most connected individuals?",
    "Which organizations are connected to key persons?",
    "Which locations appear repeatedly?",
    "Which people share a phone number?",
    "Which entities connect multiple groups?",
    "Summarize this investigation.",
  ];

  const handleAsk = async (q?: string) => {
    const query = q || question;
    if (!selectedInvestigation || !query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await generateInsight({
        investigationId: selectedInvestigation as any,
        context: `User question: ${query}`,
        question: query,
      });
      if (!result.success) {
        setError(result.error || "Failed to generate insight");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Insights</h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered analysis assistant for criminal network investigation
          </p>
        </div>

        <select
          value={selectedInvestigation}
          onChange={(e) => setSelectedInvestigation(e.target.value)}
          className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40"
        >
          <option value="">Select Investigation</option>
          {investigations?.map((inv) => (
            <option key={inv._id} value={inv._id}>
              {inv.title}
            </option>
          ))}
        </select>

        {/* Quick questions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {questions.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              disabled={!selectedInvestigation || loading}
              className="text-left p-3 rounded-lg bg-[#0f1520] border border-white/[0.06] text-xs text-gray-400 hover:text-white hover:border-white/[0.12] transition-all disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the AI assistant..."
            className="flex-1 h-11 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40"
          />
          <button
            type="submit"
            disabled={!selectedInvestigation || !question.trim() || loading}
            className="h-11 px-5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Ask
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/15 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Insights list */}
        <div className="space-y-4">
          {insights?.map((ins) => (
            <div key={ins._id} className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  AI-GENERATED ANALYSIS
                </span>
                <span className="text-[10px] text-gray-600">
                  {new Date(ins.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {ins.content}
              </div>
            </div>
          ))}
          {(!insights || insights.length === 0) && !loading && (
            <div className="text-center py-16">
              <Brain className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400">No insights yet</h3>
              <p className="text-sm text-gray-600 mt-2">
                Ask a question or use a quick question above
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
