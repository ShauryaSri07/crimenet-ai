import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Shield,
  Network,
  Brain,
  FileSearch,
  Lock,
  ArrowRight,
  AlertTriangle,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";

const FEATURES = [
  {
    icon: Network,
    title: "Network Analysis",
    desc: "Visualize criminal relationships as interactive graphs. Identify key individuals, intermediaries, and network clusters across investigations.",
  },
  {
    icon: Brain,
    title: "Intelligent Extraction",
    desc: "AI-powered analysis extracts persons, organizations, vehicles, and relationships from intelligence documents automatically.",
  },
  {
    icon: AlertTriangle,
    title: "Pattern Detection",
    desc: "Detect shared resources, geographic clustering, repeated interactions, and other suspicious connection patterns.",
  },
  {
    icon: FileText,
    title: "Investigation Management",
    desc: "Track investigations, upload intelligence documents, generate reports, and maintain a complete audit trail.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#060a12] text-white overflow-hidden">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.025]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 h-16 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide">CrimeNet AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/15 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-medium text-amber-400 uppercase tracking-widest">
              Prototype
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Criminal Network
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Analysis Platform
            </span>
          </h1>

          <p className="mt-6 text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            A law enforcement tool for analyzing criminal networks, extracting
            intelligence from documents, and identifying suspicious patterns
            across investigations.
          </p>

          <div className="flex items-center justify-center gap-3 mt-10">
            <Link
              to="/auth"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-2.5 rounded-lg border border-white/[0.08] text-gray-400 text-sm hover:text-white hover:border-white/[0.15] transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="group p-5 rounded-xl bg-[#0c1018] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 group-hover:bg-cyan-500/15 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-white/[0.06] rounded-xl p-10"
        >
          <h2 className="text-xl font-bold mb-2">Ready to Begin</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Sign in to access the platform. A synthetic demo dataset is
            available for evaluation.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-400 transition-colors"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-6 px-6 text-center">
        <p className="text-[11px] text-gray-600">
          CrimeNet AI — Criminal Network Analysis & Intelligence Platform
        </p>
        <p className="text-[10px] text-gray-700 mt-1">
          Problem Statement 26189 — Smart India Hackathon — Ministry of Home Affairs / NCRB
        </p>
      </footer>
    </div>
  );
}
