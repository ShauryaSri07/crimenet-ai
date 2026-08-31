import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/AppLayout";
import {
  Search,
  Users,
  Building2,
  MapPin,
  Car,
  Phone,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  person: { icon: Users, color: "#22d3ee" },
  organization: { icon: Building2, color: "#a78bfa" },
  location: { icon: MapPin, color: "#34d399" },
  vehicle: { icon: Car, color: "#fb923c" },
  phone: { icon: Phone, color: "#f472b6" },
  case: { icon: FileText, color: "#ef4444" },
  event: { icon: Calendar, color: "#facc15" },
};

export default function EntitiesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const allEntities = useQuery(api.entities.search, { query: search });
  const investigations = useQuery(api.investigations.list);

  const filtered = allEntities?.filter(
    (e) => !typeFilter || e.entityType === typeFilter
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Entity Explorer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Search and explore all entities across investigations
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, alias, phone, vehicle, FIR..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">All Types</option>
            {Object.keys(TYPE_CONFIG).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}s
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {!allEntities ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        ) : filtered?.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300">
              {search ? "No entities found" : "No entities yet"}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {search
                ? "Try a different search query"
                : "Upload intelligence documents to extract entities"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered?.map((entity) => {
              const cfg = TYPE_CONFIG[entity.entityType] || TYPE_CONFIG.person;
              const Icon = cfg.icon;
              return (
                <div
                  key={entity._id}
                  className="bg-[#0f1520] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cfg.color}15` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {entity.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 capitalize">
                        {entity.entityType}
                        {entity.alias && ` • ${entity.alias}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-[11px] text-gray-500">
                    {entity.city && <div>City: {entity.city}</div>}
                    {entity.phone && <div>Phone: {entity.phone}</div>}
                    {entity.registrationNumber && <div>Vehicle: {entity.registrationNumber}</div>}
                    {entity.firNumber && <div>FIR: {entity.firNumber}</div>}
                    {entity.organizationType && <div>Type: {entity.organizationType}</div>}
                    {entity.eventLocation && <div>Location: {entity.eventLocation}</div>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-medium",
                      entity.confidence >= 0.7 ? "text-green-400" : entity.confidence >= 0.4 ? "text-yellow-400" : "text-red-400"
                    )}>
                      Confidence: {(entity.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
