# Project 2: Networking Bot (Autonomous Outreach)

An **Agentic AI** system that researches prospects and drafts hyper-personalized outreach for LinkedIn, Twitter, and Instagram.

## Overview
Unlike standard chatbots, this project uses an **autonomous multi-agent architecture** to "think before acting."
- **Manager Agent**: Analyzes your request (e.g., "Reply to Alex's tweet about AI") and delegating to the right specialist.
- **Specialist Agents**: Dedicated sub-agents for **LinkedIn**, **Twitter**, and **Instagram** that know the specific tone, length limits, and best practices for each platform.
- **Research First**: The bot searches the web for the recipient's recent posts or news *before* writing a single word, ensuring high relevance.

## 🚀 Innovation: Why is this different?
This represents an evolution from simple RAG (Project 1) to **Agentic Workflows**.
- **No Vendor Lock-in**: We use **OpenRouter**, allowing us to swap models instantly.
- **Flash Models**: Optimized to run on lightweight, high-speed models (e.g., `xiaomi/mimo-v2-flash`), proving you don't need expensive models for great results.
- **Self-Healing Code**: The backend includes "fuzzy parsing" and auto-repair logic to handle imperfect model outputs gracefully.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TailwindCSS, Framer Motion.
- **Backend**: Python FastAPI, `openai-agents` (Microsoft/OpenAI framework), Pydantic.
- **LLM Provider**: OpenRouter (Model agnostic).

---

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.12+ (managed via `uv` is recommended)
- OpenRouter API Key (or OpenAI key)

### 1. Configure Environment
You need `.env` files for both backend and frontend.

**Backend (`backend/.env`):**
```bash
OPENROUTER_API_KEY=your_key_here
LLM_MODEL=xiaomi/mimo-v2-flash:free  # Or gpt-4o-mini, anthropic/claude-3.5-sonnet
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**Frontend (`frontend/.env.local`):**
```bash
# Optional for local dev (defaults to localhost:8000), required for Vercel
BACKEND_URL=https://your-railway-app.up.railway.app
```

### 2. Run Backend (Python)
We use `uv` for lightning-fast Python package management (superior to pip).
```bash
cd project-2-networking-bot/backend

# Install dependencies
uv sync

# Run server
uv run main.py
```
*Server runs on `http://localhost:8000`*

### 3. Run Frontend (Next.js)
```bash
cd project-2-networking-bot/frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## Deployment Guide

### Backend (Railway)
1.  Connect this repo to Railway.
2.  Set `Root Directory` to `project-2-networking-bot/backend`.
3.  Add your `OPENROUTER_API_KEY` in Railway Variables.
4.  Railway detects the `Dockerfile` or python environment automatically.

### Frontend (Vercel)
1.  Import this repo to Vercel.
2.  Set `Root Directory` to `project-2-networking-bot/frontend`.
3.  Add Environment Variable:
    - `BACKEND_URL`: The URL of your deployed Railway backend (e.g., `https://networking-bot.up.railway.app`).

---

## 💡 About Vibe Coding
Just like Project 1, this UI was "vibe coded"—built with AI assistance to prioritize aesthetics and fluidity (glassmorphism, micro-interactions) while maintaining robust engineering under the hood.

If you found this interesting, feel free to reach out:
- **Email**: [jobsforvybhav@gmail.com](mailto:jobsforvybhav@gmail.com)
- **LinkedIn**: [Vybhav Bhadris](https://www.linkedin.com/in/vybhav-bhadri)
