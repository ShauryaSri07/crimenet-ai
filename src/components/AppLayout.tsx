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
  Loader2,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Investigations", path: "/investigations", icon: FileSearch },
  { label: "Intelligence Upload", path: "/upload", icon: Upload },
  { label: "Entities", path: "/entities", icon: Users },
  { label: "Criminal Network", path: "/network", icon: Network },
  { label: "Relationship Explorer", path: "/relationships", icon: GitBranch },
  { label: "Pattern Detection", path: "/patterns", icon: AlertTriangle },
  { label: "AI Insights", path: "/ai-insights", icon: Brain },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Audit Logs", path: "/audit", icon: ScrollText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        const first = sr.entities[0];
        navigate(`/entities?highlight=${first._id}`);
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
          "hidden lg:flex flex-col border-r border-white/[0.06] bg-[#0c1018] transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white tracking-wide">
                CrimeNet AI
              </span>
              <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest">
                UP Police
              </span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.1)]"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-4.5 h-4.5 shrink-0", active && "text-cyan-400")} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar toggle */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-colors"
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#0c1018] border-r border-white/[0.06] transform transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">CrimeNet AI</span>
              <span className="block text-[10px] text-cyan-400/80 uppercase tracking-widest">
                UP Police
              </span>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                )}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-white/[0.06] bg-[#0a0e16]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search entities, cases..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(e.target.value.length >= 2);
                }}
                onFocus={() => setSearchOpen(searchQuery.length >= 2)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="w-48 lg:w-72 h-9 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              {searchOpen && searchResults && (
                <div className="absolute top-full left-0 mt-2 w-96 max-h-80 overflow-auto rounded-xl bg-[#141a24] border border-white/[0.08] shadow-2xl z-50">
                  {(!searchResults.entities || searchResults.entities.length === 0) &&
                  (!searchResults.investigations || searchResults.investigations.length === 0) ? (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No results found
                    </div>
                  ) : (
                    <>
                      {searchResults.entities.slice(0, 8).map((e) => (
                        <button
                          key={e._id}
                          type="button"
                          onClick={() => {
                            navigate(`/entities?highlight=${e._id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <div>
                            <div className="text-sm text-gray-200">{e.name}</div>
                            <div className="text-xs text-gray-500 capitalize">
                              {e.entityType}
                            </div>
                          </div>
                        </button>
                      ))}
                      {searchResults.investigations.slice(0, 3).map((inv) => (
                        <button
                          key={inv._id}
                          type="button"
                          onClick={() => {
                            navigate(`/investigations/${inv._id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <div>
                            <div className="text-sm text-gray-200">{inv.title}</div>
                            <div className="text-xs text-gray-500">Investigation</div>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-2">
            {/* Prototype badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                UP POLICE — AI INTELLIGENCE PROTOTYPE
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            {/* User menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0] || user?.email?.[0] || "U"}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
