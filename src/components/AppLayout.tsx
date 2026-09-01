import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Shield,
  LayoutDashboard,
  FileSearch,
  Upload,
  Users,
  Network,
  GitBranch,
  AlertTriangle,
  Brain,
  FileText,
  ScrollText,
  Settings,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Investigations", path: "/investigations", icon: FileSearch },
  { label: "Upload Intel", path: "/upload", icon: Upload },
  { label: "Entities", path: "/entities", icon: Users },
  { label: "Network", path: "/network", icon: Network },
  { label: "Relationships", path: "/relationships", icon: GitBranch },
  { label: "Patterns", path: "/patterns", icon: AlertTriangle },
  { label: "AI Insights", path: "/ai-insights", icon: Brain },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Audit Log", path: "/audit", icon: ScrollText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const searchResults = useQuery(
    api.search.global,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip"
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sr = searchResults;
      if (sr?.entities && sr.entities.length > 0) {
        navigate(`/entities?highlight=${sr.entities[0]._id}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchResults, navigate]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c14]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-white/[0.06] bg-[#0c1018] transition-all duration-200",
          sidebarOpen ? "w-56" : "w-14"
        )}
      >
        <div className="flex items-center gap-2.5 px-3.5 h-14 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-sm font-semibold text-white tracking-wide">
              CrimeNet AI
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors",
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active && "text-cyan-400")} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/[0.06]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/[0.03] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0c1018] border-r border-white/[0.06] transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-3.5 h-14 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">CrimeNet AI</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="py-2.5 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors",
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-4 lg:px-5 border-b border-white/[0.06] bg-[#0a0e16]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <Menu className="w-4 h-4" />
            </button>

          </div>

          <div className="flex items-center gap-1.5">
            <button className="relative p-1.5 rounded-md text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </button>

            <div className="w-px h-5 bg-white/[0.06] mx-1" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </div>
              <button
                onClick={() => signOut()}
                className="p-1 rounded-md text-gray-600 hover:text-red-400 hover:bg-white/[0.03] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
