# MAPFM — Multi-Agent Portfolio & Financial Management

> **An AI-powered investment platform combining Multi-Agent Reinforcement Learning, TOPSIS/WSM multi-criteria decision-making, and a Claude-powered conversational AI to manage 213 global assets under uncertainty.**

---

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-00D4FF?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/license-Academic-green?style=flat-square)
![Status](https://img.shields.io/badge/status-Active-success?style=flat-square)

**MAIB · Group Project 4 · Reasoning & Decision Making Under Uncertainty**
**Instructor: Dr. Sandip Kumar Roy · DXB Section A · Sept 2025 Term 2**

</div>

---

## Table of Contents

- [Overview](#overview)
- [The Three Agents](#the-three-agents)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Dataset](#dataset)
- [Algorithms](#algorithms)
- [Dashboard Tabs](#dashboard-tabs)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Team](#team)

---

## Overview

MAPFM addresses a core challenge in modern portfolio management: **multiple stakeholders with conflicting objectives**. A human investor wants maximum returns. A quantitative AI advisor wants optimal risk-adjusted rankings. A regulator demands ESG compliance and concentration limits. These goals clash constantly.

MAPFM models this tension explicitly through three specialized AI agents that collaborate, negotiate, and override each other to produce a final compliant portfolio — all visualized in a real-time dashboard with a conversational AI interface.

### What Makes This Different

| Feature | Traditional Tools | MAPFM |
|---|---|---|
| Optimization | Single objective | 4-criteria multi-agent |
| Decision transparency | Black box | Fully auditable TOPSIS |
| ESG enforcement | Optional filter | Hard constraint (agent veto) |
| Market adaptation | Static rules | PPO reinforcement learning |
| User interaction | Forms & buttons | Natural language chatbot |
| Data scope | Single market | 213 assets, 4 regions |

---

## The Three Agents

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT PIPELINE                           │
│                                                             │
│  [Market Data] → [Investor Agent] → [AI Advisor]           │
│                                          ↓                  │
│                                   [Regulator Agent]         │
│                                          ↓                  │
│                                  [Final Portfolio]          │
└─────────────────────────────────────────────────────────────┘
```

### 💼 Investor Agent
- **Algorithm**: Proximal Policy Optimization (PPO) via Stable-Baselines3
- **Objective**: Maximize portfolio Sharpe Ratio
- **State space**: Price history, rolling volatility, TOPSIS rankings, ESG scores, market scenario
- **Action space**: Continuous weight delta vector (softmax normalized)
- **Reward**: `0.6 × Sharpe + 0.3 × ESG_compliance − 0.1 × Concentration_penalty`
- **Priority**: 3rd — proposes weights, subject to override

### 🤖 AI Advisor Agent
- **Algorithm**: TOPSIS + Weighted Sum Model (WSM)
- **Objective**: Multi-criteria asset ranking across Return, Risk, Liquidity, ESG
- **Output**: Closeness score C ∈ [0,1] per asset — higher = closer to ideal
- **Weights**: User-adjustable via live dashboard sliders
- **Priority**: 2nd — advises Investor Agent, flags conflicts

### ⚖️ Regulator Agent
- **Algorithm**: Rule-based constraint enforcement engine
- **Objective**: Enforce ESG floor (min 65/100) and concentration cap (max 25% per asset)
- **Override rate**: ~12% of Investor Agent decisions in simulation
- **Priority**: 1st — absolute veto authority, final say

### Conflict Resolution Hierarchy
```
Regulator (Hard Override) > AI Advisor (Soft Recommendation) > Investor (Baseline Policy)
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION TIER  (React 18 + Recharts + Tailwind CSS)        │
│  7 Tabs: Overview | TOPSIS | Risk/Return | Sector | ESG |       │
│          Rankings | PortfolioAI Chatbot                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│  APPLICATION TIER  (FastAPI + Uvicorn, Python 3.11)             │
│  /api/portfolio  /api/topsis  /api/chat  /api/simulate          │
└──────┬────────────────────┬──────────────────┬───────────────────┘
       │                    │                  │
┌──────▼──────┐   ┌─────────▼──────┐   ┌──────▼────────┐
│  INVESTOR   │   │  AI ADVISOR    │   │  REGULATOR    │
│  PPO (SB3)  │   │  TOPSIS + WSM  │   │  Constraint   │
│  Gymnasium  │   │  NumPy/SciPy   │   │  Engine       │
└──────┬──────┘   └────────────────┘   └───────────────┘
       │
┌──────▼──────────────────────────────────────────────────────────┐
│  DATA TIER                                                      │
│  Yahoo Finance (yfinance) │ ESG DB (CSV) │ Redis Cache          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| `fastapi` | 0.110+ | REST API framework |
| `uvicorn` | 0.27+ | ASGI server |
| `stable-baselines3` | 2.2+ | PPO implementation |
| `gymnasium` | 0.29+ | RL environment interface |
| `yfinance` | 0.2+ | Market data fetching |
| `pandas` | 2.1+ | Data manipulation |
| `numpy` | 1.26+ | TOPSIS matrix operations |
| `scipy` | 1.11+ | Normalization, distance metrics |
| `anthropic` | 0.20+ | Claude chatbot API |
| `python-dotenv` | 1.0+ | Environment variable management |
| `pydantic` | 2.0+ | Request/response validation |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| `react` | 18+ | Core UI framework |
| `recharts` | 2.10+ | Charts (Area, Bar, Scatter, Radar) |
| `tailwindcss` | 3.4+ | Utility CSS styling |
| `axios` | 1.6+ | HTTP client |
| `zustand` | 4.4+ | Lightweight state management |
| `react-query` | 5.0+ | Server state & caching |
| `socket.io-client` | 4.6+ | WebSocket for agent logs |

---

## Dataset

The platform uses a real dataset of **213 global assets** compiled from Yahoo Finance and ESG research databases.

### Coverage
| Dimension | Details |
|---|---|
| Total assets | 213 |
| Sectors | Technology (53), Consumer (36), Finance (33), Healthcare (21), Energy (18), ETF (12), Industrials (11), Materials (11), Utilities (9), Real Estate (5), Bonds (4) |
| Regions | US (103), India (48), Europe (32), Asia (30) |
| Market Cap | Large (148), Mid (46), Small (19) |

### Fields per Asset (14 columns)
```
Asset_Name, Sector, Price, Expected_Return, Risk, Liquidity,
ESG_Score, Market_Cap, Region, Dividend_Yield, Beta,
Bull_Return_Adjustment, Bear_Return_Adjustment, Volatility_Shock
```

### Dataset Highlights
- 🏆 **Top Return**: NVIDIA Corp — 28.34% expected annual return
- 🌱 **Top ESG**: Vestas Wind Systems — 90/100 sustainability score
- ⚖️ **Best Risk-Adjusted**: Novo Nordisk — 22.69% return at only 21.9% risk
- 🛡️ **Safest Asset**: Vanguard Total Bond — 7.8% volatility, 99% liquidity
- 📈 **Highest Beta**: Lucid Group — 1.74 market sensitivity

---

## Algorithms

### PPO — Proximal Policy Optimization

The Investor Agent learns optimal allocation policies through simulated market episodes.

```
Reward = 0.6 × Sharpe(t)
       + 0.3 × ESG_compliance(t)
       - 0.1 × Concentration_penalty(t)
```

**Training config:**
- 500 episodes × 60 steps/episode
- Policy network: MLP [256, 128] with ReLU activation
- Clip ratio ε = 0.2
- Learning rate: 3e-4 with linear decay
- Optimizer: Adam

### TOPSIS — 7-Step Process

1. **Decision Matrix**: X[assets × criteria]
2. **Normalize**: r[i,j] = x[i,j] / √(Σ x[i,j]²)
3. **Weight**: v[i,j] = w[j] × r[i,j] where Σw[j] = 1
4. **Ideal Solutions**: A⁺ = best per criterion, A⁻ = worst
5. **Separation**: S⁺[i] = √(Σ(v[i,j] − A⁺[j])²)
6. **Score**: C[i] = S⁻[i] / (S⁺[i] + S⁻[i]) ∈ [0,1]
7. **Rank**: Higher C = closer to ideal solution

### WSM — Weighted Sum Model

```
Score(i) = w_return × Return(i)
         + w_risk   × (1 − Risk(i))
         + w_liq    × Liquidity(i)
         + w_esg    × ESG(i) / 100
```

Default weights: Return 35%, Risk 30%, Liquidity 20%, ESG 15%

---

## Dashboard Tabs

| Tab | Purpose | Key Features |
|---|---|---|
| **Overview** | Portfolio summary | Performance chart, allocation bars, agent log, radar |
| **TOPSIS Panel** | Live ranking | WSM sliders, real-time C-scores, criteria breakdown |
| **Risk vs Return** | Scatter analysis | 213-asset plot, sector colors, quadrant analysis |
| **Sector Analysis** | Sector deep dive | Risk bars, dividend chart, 6-metric table |
| **ESG & Ethics** | Sustainability | Top 10 ESG, regulator floor line, ESG-return scatter |
| **Rankings** | League tables | Top return, top ESG, Bull vs Bear spread |
| **PortfolioAI** | AI chatbot | Claude API, dataset context, quick questions |

Global filters: **Sector** and **Region** dropdowns apply across all tabs simultaneously.

---

## Project Structure

```
mapfm/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── agents/
│   │   ├── investor_agent.py      # PPO training & inference
│   │   ├── advisor_agent.py       # TOPSIS + WSM engine
│   │   └── regulator_agent.py     # Constraint enforcement
│   ├── environment/
│   │   └── portfolio_env.py       # Custom Gymnasium environment
│   ├── data/
│   │   ├── market_data.py         # yfinance data fetcher
│   │   └── portfolio_dataset.csv  # 213-asset dataset
│   ├── api/
│   │   ├── portfolio.py           # /api/portfolio endpoints
│   │   ├── topsis.py              # /api/topsis endpoint
│   │   ├── chat.py                # /api/chat → Claude API
│   │   └── simulate.py            # /api/simulate scenarios
│   ├── models/                    # Saved RL checkpoints (.zip)
│   ├── requirements.txt
│   └── .env                       # API keys (never commit)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Overview tab
│   │   │   ├── TopsisPanel.jsx    # TOPSIS + sliders
│   │   │   ├── Chatbot.jsx        # PortfolioAI chat
│   │   │   └── AgentsTab.jsx      # Agent detail cards
│   │   ├── store/
│   │   │   └── portfolioStore.js  # Zustand state
│   │   └── api/
│   │       └── client.js          # Axios instance
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/
│   ├── README.md                  # This file
│   ├── MAPFM_Blueprint.docx       # Full product blueprint
│   ├── MAPFM_Executive_Summary.docx
│   ├── MAPFM_Requirements_Specification.docx
│   └── GenAI_Prompt_Disclosure.docx
│
└── portfolio_viz_dashboard.jsx    # Standalone viz artifact
```

---

## Getting Started

### Prerequisites

| Requirement | Minimum | Recommended |
|---|---|---|
| Python | 3.10 | 3.11 |
| Node.js | 18 LTS | 20 LTS |
| RAM | 8 GB | 16 GB |
| Disk | 5 GB free | 10 GB |
| Anthropic API Key | Required | — |

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-team/mapfm.git
cd mapfm
```

**2. Backend setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Frontend setup**
```bash
cd frontend
npm install
```

---

## Environment Variables

Create `backend/.env`:

```env
# Anthropic Claude API (required for chatbot)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional: Redis cache
REDIS_URL=redis://localhost:6379

# Optional: Override data source
DATA_PATH=./data/portfolio_dataset.csv

# Server
HOST=0.0.0.0
PORT=8000
```

> ⚠️ **Never commit `.env` to version control.** It is already in `.gitignore`.

---

## Running the App

### Train the RL Agent (first time only)
```bash
cd backend
python agents/investor_agent.py --train --episodes 500
# Model saved to: models/investor_ppo.zip
# Training takes ~10-20 min on CPU, ~3 min with GPU
```

### Start the Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# API available at: http://localhost:8000
# Docs at: http://localhost:8000/docs
```

### Start the Frontend
```bash
cd frontend
npm run dev
# Dashboard at: http://localhost:3000
```

### Quick Demo (skip RL training)
```bash
# Run with simulated/pre-trained agent
uvicorn main:app --reload --env-file .env.demo
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/portfolio` | GET | Current portfolio state, weights, performance |
| `/api/topsis` | POST | Run TOPSIS with custom WSM weights |
| `/api/simulate` | POST | Run scenario simulation (Bull/Bear/etc.) |
| `/api/chat` | POST | Send message to PortfolioAI via Claude API |
| `/api/agents/status` | GET | Current status of all 3 agents |
| `/api/data/assets` | GET | Full 213-asset dataset as JSON |
| `/ws/agent-log` | WS | Real-time agent decision stream |

### Example: TOPSIS Request
```json
POST /api/topsis
{
  "weights": {
    "return": 0.35,
    "risk": 0.30,
    "liquidity": 0.20,
    "esg": 0.15
  },
  "sector_filter": "Technology",
  "region_filter": "All"
}
```

### Example: Chat Request
```json
POST /api/chat
{
  "message": "Which assets pass the ESG floor?",
  "conversation_history": []
}
```

---

## Market Scenarios

The platform supports 5 simulation scenarios:

| Scenario | Effect on Returns | Effect on Volatility |
|---|---|---|
| **Bull Market** | +Bull_Return_Adjustment | Normal |
| **Bear Market** | −Bear_Return_Adjustment | ×Volatility_Shock |
| **High Volatility** | Normal | ×2 Volatility_Shock |
| **Stable Growth** | Moderate positive | Reduced |
| **Crisis** | Severe negative | Extreme |

---

## Key Results

- ✅ Portfolio Sharpe Ratio: **1.84** (target > 1.5)
- ✅ ESG Constraint Violations: **0** across all sessions
- ✅ Regulator Override Rate: **~12%** of Investor decisions
- ✅ Chatbot Response Time: **< 3 seconds** per query
- ✅ Dashboard Load Time: **< 2 seconds**

---

## Academic Context

This project demonstrates:

- **Multi-Agent Reinforcement Learning** — heterogeneous agents with conflicting reward structures
- **Multi-Criteria Decision Making** — TOPSIS/WSM with interactive weight adjustment
- **Bounded Rationality** — agents operating under market uncertainty
- **Game Theory** — Stackelberg hierarchy: Regulator → Advisor → Investor
- **Behavioral Finance** — ESG preference modeling and Bear scenario loss aversion

---

## Team

| Role | Responsibility |
|---|---|
| ML Engineer | PPO agent training, Gymnasium environment |
| Backend Developer | FastAPI, data pipeline, agent orchestration |
| Frontend Developer | React dashboard, Recharts visualizations |
| Data Analyst | Dataset curation, ESG scoring, sector analysis |
| AI/NLP Engineer | Claude API integration, PortfolioAI chatbot |

---

## License

This project is submitted for academic evaluation at MAIB under the course *Reasoning and Decision Making Under Uncertainty* (Dr. Sandip Kumar Roy). Not for commercial use.

---

<div align="center">
<strong>MAPFM · MAIB Group Project 4 · DXB Section A · 2026</strong>
</div>
