import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import {
  Database,
  Shield,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const hasData = useQuery(api.demo.isLoaded);
  const loadDemo = useMutation(api.demo.loadDemoData);
  const clearAll = useMutation(api.demo.clearAll);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLoadDemo = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await loadDemo();
      setMessage(
        `Loaded demo data: ${result.entities} entities, ${result.relationships} relationships in investigation "${result.investigationId}"`
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load demo data");
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear ALL data? This cannot be undone.")) return;
    setLoading(true);
    setMessage("");
    try {
      await clearAll();
      setMessage("All data cleared successfully");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to clear data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">System configuration and data management</p>
        </div>

        {/* User info */}
        <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            User Profile
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>{" "}
              <span className="text-gray-200">{user?.name || "Anonymous"}</span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              <span className="text-gray-200">{user?.email || "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>{" "}
              <span className="text-gray-200 capitalize">{(user as any)?.role || "Investigator"}</span>
            </div>
          </div>
        </div>

        {/* Demo Data */}
        <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Synthetic Demo Data
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Load or clear synthetic demonstration data. SYNTHETIC DEMO DATA — FOR DEMONSTRATION ONLY.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs">
              {hasData ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Demo data loaded</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-yellow-400">No demo data</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLoadDemo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors border border-amber-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Load Demo Dataset
            </button>
            {hasData && (
              <button
                onClick={handleClearData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            )}
          </div>

          {message && (
            <div className="mt-3 p-3 rounded-lg bg-white/[0.02] text-xs text-gray-300">
              {message}
            </div>
          )}
        </div>

        {/* System info */}
        <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">System Information</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-gray-500">Platform:</span> <span className="text-gray-200">CrimeNet AI v1.0</span></div>
            <div><span className="text-gray-500">Backend:</span> <span className="text-gray-200">Convex Serverless</span></div>
            <div><span className="text-gray-500">AI Engine:</span> <span className="text-gray-200">Google Gemini</span></div>
            <div><span className="text-gray-500">Frontend:</span> <span className="text-gray-200">React + TypeScript</span></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
