# CrimeNet AI — UP Police Criminal Network Analysis & Intelligence Platform

## Problem Statement

**Problem Statement ID:** 26189
**Title:** AI-Powered Criminal Network Analysis System
**Organization:** Ministry of Home Affairs / National Crime Records Bureau (NCRB) / Women Safety Division
**Theme:** Blockchain & Cybersecurity
**Hackathon:** Smart India Hackathon

## Overview

CrimeNet AI is a full-stack web application designed to help UP Police investigators analyze fragmented structured and unstructured crime/intelligence information. The platform extracts entities and relationships from intelligence documents using AI, builds criminal relationship networks, calculates network-analysis metrics, detects suspicious patterns, and provides interactive visualizations.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  Tailwind CSS • Cytoscape.js • Recharts • Framer Motion        │
├─────────────────────────────────────────────────────────────────┤
│                     CONVEX (Serverless Backend)                 │
│  Queries • Mutations • Actions • Real-time Subscriptions        │
├─────────────────────────────────────────────────────────────────┤
│                    CONVEX DATABASE (PostgreSQL)                  │
│  Investigations • Entities • Relationships • Patterns • etc.    │
├─────────────────────────────────────────────────────────────────┤
│                    AI ENGINE (Google Gemini)                     │
│  Entity Extraction • Relationship Extraction • Insights          │
└─────────────────────────────────────────────────────────────────┘
```

## Features

### Core Capabilities
- **Dynamic Dashboard** — Real-time statistics computed from database
- **Investigation Management** — Create, edit, track investigations with status/priority
- **Intelligence Upload** — Submit text for AI-powered entity and relationship extraction
- **Entity Explorer** — Search across all persons, organizations, locations, vehicles, phones, cases, events
- **Criminal Network Graph** — Interactive Cytoscape.js visualization with zoom, pan, node selection, type filtering
- **Relationship Explorer** — Searchable/filterable relationship table with pagination
- **Pattern Detection** — Automated detection of shared phones, vehicles, geographic clustering, intermediaries, repeated interactions
- **AI Investigation Assistant** — Ask questions and get evidence-grounded answers
- **Report Generation** — Export investigation reports to JSON/CSV
- **Audit Logs** — Complete activity trail for all system actions

### Graph Analytics (JavaScript implementations)
- **Degree Centrality** — Entities with many direct connections
- **Betweenness Centrality** — Entities connecting otherwise separated groups
- **Closeness Centrality** — Average shortest path distance
- **PageRank / Influence Score** — Structurally important entities
- **Community Detection** — Connected component clustering

### AI Pipeline
```
USER UPLOADS REPORT
↓
CONVEX RECEIVES TEXT
↓
GEMINI ENTITY EXTRACTION
↓
GEMINI RELATIONSHIP EXTRACTION
↓
VALIDATION & NORMALIZATION
↓
CONVEX DATABASE
↓
GRAPH CONSTRUCTION
↓
NETWORK ANALYTICS (Centrality, PageRank, Community)
↓
PATTERN DETECTION
↓
REACT DASHBOARD (Graphs + Charts + AI Insights)
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Graph Visualization | Cytoscape.js |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | Convex (Serverless) |
| Database | Convex Database (PostgreSQL) |
| Auth | Convex Auth (Email OTP + Anonymous) |
| AI | Google Gemini API |
| Icons | Lucide React |
| Package Manager | Bun |

## Getting Started

### Prerequisites
- Node.js / Bun
- Convex account (free tier works)

### Environment Variables

The app needs a `GEMINI_API_KEY` for AI features. Add this as a **Convex Secret** in your Convex dashboard:

1. Go to your Convex dashboard
2. Navigate to Settings → Environment Variables
3. Add `GEMINI_API_KEY` with your Google Gemini API key

**Important:** The API key is kept server-side only. It is never exposed to the frontend.

### Installation

```bash
# Install dependencies
bun install

# Start Convex dev server
bun convex dev

# In another terminal, start Vite
bun run dev
```

### Demo Data

1. Sign in to the app
2. Go to **Settings**
3. Click **Load Demo Dataset**
4. This loads a comprehensive synthetic dataset with:
   - 12 persons, 5 organizations, 8 locations, 4 vehicles, 5 phones, 3 cases, 4 events
   - 48+ interconnected relationships
   - Fictional Indian names and locations

**Note:** All demo data is synthetic and clearly labeled "SYNTHETIC DEMO DATA — FOR DEMONSTRATION ONLY".

## Data Models

### Entity Types
- **Person** — Individuals involved in criminal networks
- **Organization** — Criminal organizations, businesses, front companies
- **Location** — Cities, districts, specific locations
- **Vehicle** — Vehicles used in criminal activities
- **Phone** — Phone numbers used for communication
- **Case/FIR** — Police cases and FIRs
- **Event** — Meetings, shipments, cash transfers

### Relationship Types
- `communicated_with` — Communication between persons
- `associated_with` — Association with organizations
- `uses` — Phone/vehicle usage
- `owns` — Vehicle ownership
- `visited` — Location visits
- `involved_in` — Case/FIR involvement
- `participated_in` — Event participation
- `operates_in` — Organization operating area
- `occurred_at` — Case/event location

### Confidence Levels
- 0.90–1.00 = Very High
- 0.70–0.89 = High
- 0.40–0.69 = Medium
- 0.00–0.39 = Low

## API Structure

All APIs are Convex functions (queries, mutations, actions):

| Function | Type | Description |
|----------|------|-------------|
| `investigations.list` | Query | List all investigations |
| `investigations.create` | Mutation | Create investigation |
| `entities.list` | Query | List entities for investigation |
| `entities.search` | Query | Search entities across all fields |
| `relationships.list` | Query | List relationships with enriched names |
| `network.graphData` | Query | Get graph nodes and edges |
| `network.computeMetrics` | Action | Calculate centrality and PageRank |
| `patterns.detectPatterns` | Mutation | Run pattern detection engine |
| `ai.extractEntities` | Action | Gemini AI entity extraction |
| `ai.extractRelationships` | Action | Gemini AI relationship extraction |
| `ai.generateInsight` | Action | AI-generated analytical insights |
| `ai.generateSummary` | Action | AI investigation summary |
| `reports.generate` | Query | Generate report data |
| `audit.list` | Query | List audit logs |
| `demo.loadDemoData` | Mutation | Load synthetic demo dataset |

## Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx          # Main layout with sidebar + topbar
│   ├── NetworkGraph.tsx       # Cytoscape.js network visualization
│   ├── DashboardCharts.tsx    # Recharts chart components
│   ├── RequireAuth.tsx        # Auth guard
│   └── ui/                    # shadcn/ui components
├── convex/
│   ├── schema.ts              # Database schema
│   ├── auth.ts                # Auth configuration
│   ├── investigations.ts      # Investigation CRUD
│   ├── entities.ts            # Entity CRUD + search
│   ├── relationships.ts       # Relationship CRUD
│   ├── documents.ts           # Document management
│   ├── network.ts             # Graph data + analytics
│   ├── patterns.ts            # Pattern detection engine
│   ├── ai.ts                  # Gemini AI integration
│   ├── dashboard.ts           # Dashboard statistics
│   ├── demo.ts                # Synthetic demo data
│   ├── search.ts              # Global search
│   ├── insights.ts            # AI insights storage
│   ├── reports.ts             # Report generation
│   └── audit.ts               # Audit logging
├── pages/
│   ├── Landing.tsx            # Cybersecurity-themed landing page
│   ├── Auth.tsx               # Authentication
│   ├── Dashboard.tsx          # Dynamic dashboard
│   ├── Investigations.tsx     # Investigation list
│   ├── InvestigationDetail.tsx # Investigation detail with tabs
│   ├── IntelligenceUpload.tsx # AI document analysis
│   ├── Entities.tsx           # Entity explorer
│   ├── CriminalNetwork.tsx    # Network graph page
│   ├── RelationshipExplorer.tsx # Relationship table
│   ├── PatternDetection.tsx   # Pattern detection
│   ├── AIInsights.tsx         # AI assistant
│   ├── Reports.tsx            # Report generation
│   ├── AuditLogs.tsx          # Audit trail
│   └── Settings.tsx           # Settings + demo data
├── hooks/
│   └── use-auth.ts            # Auth hook
├── lib/
│   └── utils.ts               # Utility functions
├── main.tsx                   # App entrypoint + routing
└── index.css                  # Theme + Tailwind config
```

## Privacy & Safety

- All demonstration data is **fictional** and clearly labeled
- No actual criminal records or personal information is used
- The platform is a **prototype** for hackathon demonstration
- AI responses are clearly labeled as "AI-GENERATED ANALYSIS"
- Source traceability maintained for all extracted information

## License

This project is developed for Smart India Hackathon demonstration purposes.
