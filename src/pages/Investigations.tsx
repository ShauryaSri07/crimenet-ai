import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router";
import {
  Plus,
  Loader2,
  Clock,
  AlertCircle,
  CheckCircle2,
  PauseCircle,
  FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-cyan-400", bg: "bg-cyan-500/10", icon: Clock },
  under_investigation: { label: "Under Investigation", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: AlertCircle },
  closed: { label: "Closed", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 },
  suspended: { label: "Suspended", color: "text-red-400", bg: "bg-red-500/10", icon: PauseCircle },
};

const PRIORITY_COLORS = {
  low: "text-blue-400 bg-blue-500/10",
  medium: "text-yellow-400 bg-yellow-500/10",
  high: "text-orange-400 bg-orange-500/10",
  critical: "text-red-400 bg-red-500/10",
};

export default function InvestigationsPage() {
  const investigations = useQuery(api.investigations.list);
  const createInvestigation = useMutation(api.investigations.create);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open" as const,
    priority: "medium" as const,
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createInvestigation(form);
      setShowCreate(false);
      setForm({ title: "", description: "", status: "open", priority: "medium" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Investigations</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track criminal investigations
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Investigation
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="bg-[#0f1520] border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Create New Investigation
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40"
                  placeholder="Investigation title"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full h-20 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40 resize-none"
                  placeholder="Investigation description"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as any })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40"
                  >
                    <option value="open">Open</option>
                    <option value="under_investigation">Under Investigation</option>
                    <option value="closed">Closed</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value as any })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Investigation list */}
        {!investigations ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        ) : investigations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileSearch className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300">
              No investigations yet
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Create your first investigation to start analyzing criminal
              networks
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {investigations.map((inv) => {
              const statusCfg = STATUS_CONFIG[inv.status];
              const StatusIcon = statusCfg.icon;
              return (
                <Link
                  key={inv._id}
                  to={`/investigations/${inv._id}`}
                  className="block bg-[#0f1520] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                        {inv.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {inv.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium",
                          PRIORITY_COLORS[inv.priority]
                        )}
                      >
                        {inv.priority.toUpperCase()}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium",
                          statusCfg.bg,
                          statusCfg.color
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-600">
                    <span>
                      Created{" "}
                      {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(inv.updatedAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
