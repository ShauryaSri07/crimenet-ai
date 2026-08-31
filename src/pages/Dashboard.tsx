import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/AppLayout";
import {
  DistributionChart,
  RelationshipChart,
  StatusChart,
} from "@/components/DashboardCharts";
import {
  FileSearch,
  Users,
  GitBranch,
  AlertTriangle,
  Activity,
  Shield,
  TrendingUp,
  FileText,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-gray-500 truncate">{label}</div>
        </div>
      </div>
      {sub && <div className="mt-2 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.stats);
  const invStats = useQuery(api.investigations.stats);
  const entityDist = useQuery(api.entities.globalStats);
  const relDist = useQuery(api.relationships.globalStats);
  const hasData = useQuery(api.demo.isLoaded);

  if (!stats) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Intelligence Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time analytics from investigation database
            </p>
          </div>
          {!hasData && (
            <Link
              to="/settings"
              className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
            >
              Load Demo Data
            </Link>
          )}
        </div>

        {/* Synthetic data banner */}
        {hasData && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-amber-400">
              SYNTHETIC DEMO DATA — FOR DEMONSTRATION ONLY
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Investigations"
            value={stats.totalInvestigations}
            icon={FileSearch}
            color="#22d3ee"
          />
          <StatCard
            label="Active Investigations"
            value={stats.activeInvestigations}
            icon={Activity}
            color="#facc15"
          />
          <StatCard
            label="Total Entities"
            value={stats.totalEntities}
            icon={Users}
            color="#a78bfa"
          />
          <StatCard
            label="Relationships"
            value={stats.totalRelationships}
            icon={GitBranch}
            color="#34d399"
          />
          <StatCard
            label="Persons"
            value={stats.persons}
            icon={Users}
            color="#22d3ee"
          />
          <StatCard
            label="Organizations"
            value={stats.organizations}
            icon={Shield}
            color="#a78bfa"
          />
          <StatCard
            label="Locations"
            value={stats.locations}
            icon={Activity}
            color="#34d399"
          />
          <StatCard
            label="Cases / FIRs"
            value={stats.cases}
            icon={FileText}
            color="#ef4444"
          />
          <StatCard
            label="Vehicles"
            value={stats.vehicles}
            icon={TrendingUp}
            color="#fb923c"
          />
          <StatCard
            label="Phone Numbers"
            value={stats.phones}
            icon={Shield}
            color="#f472b6"
          />
          <StatCard
            label="Events"
            value={stats.events}
            icon={Activity}
            color="#facc15"
          />
          <StatCard
            label="Detected Patterns"
            value={stats.totalPatterns}
            icon={AlertTriangle}
            color="#ef4444"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
            <DistributionChart
              data={entityDist?.distribution || {}}
              title="Entity Distribution"
            />
          </div>
          <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
            <RelationshipChart data={relDist?.byType || {}} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
            <StatusChart
              data={invStats?.byStatus || {}}
              title="Investigation Status"
            />
          </div>
          <div className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-5">
            <StatusChart
              data={invStats?.byPriority || {}}
              title="Priority Distribution"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Investigation", path: "/investigations", color: "cyan" },
            { label: "Upload Intel", path: "/upload", color: "blue" },
            { label: "View Network", path: "/network", color: "purple" },
            { label: "AI Analysis", path: "/ai-insights", color: "emerald" },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center justify-center p-4 rounded-xl bg-[#0f1520] border border-white/[0.06] hover:border-white/[0.12] transition-all text-sm font-medium text-gray-300 hover:text-white"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
