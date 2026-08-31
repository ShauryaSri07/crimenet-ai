import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Shield,
  Network,
  Brain,
  FileSearch,
  Lock,
  ArrowRight,
  Zap,
  Eye,
  AlertTriangle,
  Users,
  BarChart3,
  Globe,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    desc: "Gemini AI extracts entities, relationships, and generates insights from intelligence documents",
  },
  {
    icon: Network,
    title: "Network Visualization",
    desc: "Interactive criminal network graphs with centrality metrics and community detection",
  },
  {
    icon: AlertTriangle,
    title: "Pattern Detection",
    desc: "Automated detection of shared phones, vehicles, geographic clustering, and intermediary patterns",
  },
  {
    icon: Eye,
    title: "Entity Resolution",
    desc: "Cross-reference persons, organizations, locations, vehicles, and communication records",
  },
  {
    icon: BarChart3,
    title: "Dynamic Analytics",
    desc: "Real-time charts and metrics computed from PostgreSQL through Convex backend",
  },
  {
    icon: Lock,
    title: "Secure & Audited",
    desc: "JWT authentication, role-based access, comprehensive audit logging, and encrypted data",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#060a12] text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 h-16 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-wide">CrimeNet AI</span>
            <span className="block text-[9px] text-cyan-400/70 uppercase tracking-[0.2em]">
              UP Police Intelligence Platform
            </span>
          </div>
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
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Prototype badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/5 border border-amber-500/15 mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
              UP POLICE — AI INTELLIGENCE PROTOTYPE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            AI-Powered{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Criminal Network
            </span>{" "}
            Analysis
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Analyze fragmented intelligence, extract entities and relationships
            with AI, visualize criminal networks, and detect suspicious patterns
            — all in one platform built for{" "}
            <span className="text-cyan-400">Smart India Hackathon</span>.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              to="/auth"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-3 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14 text-center">
            {[
              { val: "15+", label: "Network Metrics" },
              { val: "7", label: "Entity Types" },
              { val: "10+", label: "AI Analysis Features" },
              { val: "Real-time", label: "Graph Analytics" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-cyan-400">{stat.val}</div>
                <div className="text-[11px] text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Intelligence-Driven Investigation
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-lg mx-auto">
            Everything you need to analyze criminal networks, from document
            ingestion to AI-powered insights
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group p-6 rounded-2xl bg-[#0c1018] border border-white/[0.04] hover:border-white/[0.1] transition-all hover:bg-[#0f1520]"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/15 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">
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

      {/* Architecture */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Complete AI Data Pipeline
          </h2>
          <p className="text-center text-gray-500 mb-12">
            From document ingestion to network intelligence
          </p>

          <div className="bg-[#0c1018] border border-white/[0.06] rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Upload", desc: "Intelligence documents", icon: FileSearch },
                { step: "02", title: "AI Extract", desc: "Entities & relationships", icon: Brain },
                { step: "03", title: "Analyze", desc: "Graph analytics & patterns", icon: Network },
                { step: "04", title: "Report", desc: "AI-generated insights", icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="text-center">
                    <div className="text-[10px] text-cyan-400 font-bold mb-2">
                      STEP {item.step}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-[#0c1018] to-[#060a12] border border-white/[0.06] rounded-2xl p-12"
        >
          <Zap className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to Start?</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            Load the synthetic demo dataset and explore the full AI-powered
            criminal network analysis platform
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
          >
            Launch CrimeNet AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-6 text-center">
        <p className="text-xs text-gray-600">
          CrimeNet AI — AI-Powered Criminal Network Analysis & Intelligence
          Platform
        </p>
        <p className="text-[10px] text-gray-700 mt-1">
          Problem Statement ID: 26189 • Smart India Hackathon • Ministry of Home
          Affairs / NCRB
        </p>
        <p className="text-[10px] text-gray-700 mt-1">
          SYNTHETIC DEMO DATA — FOR DEMONSTRATION ONLY
        </p>
      </footer>
    </div>
  );
}
