# Project 1: Resume Agent

A personal AI assistant that parses your resume and answers professional queries about you.

## Overview
This project uses a Next.js frontend and a Python (FastAPI) backend to create a conversational agent. Key features:
- **Premium UI**: Glassmorphism design with smooth animations.
- **RAG-lite**: Parses `resume.pdf` to answer questions contextually.
- **Email Drafting**: Can help recruiters draft emails to you.

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.9+
- OpenAI API Key

### 1. Configure Environment
Create a `.env` file in the root of `project-1-resume-agent`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OWNER_NAME=Your Name
NEXT_PUBLIC_OWNER_EMAIL=your.email@example.com
```
> [!NOTE]
> **API Compatibility**: You can use any OpenAI-compatible API endpoint (e.g. Groq, DeepSeek, OpenRouter) by setting the `OPENAI_BASE_URL` if needed. 
> - **Anthropic is NOT supported** as it uses a different SDK signature.
> - **Open Source / Local**: You can use **Ollama** for local testing, but remember: if you deploy this app to Vercel, it won't be able to access your local Ollama instance. For online deployment, you will need a hosted provider's API key.

### 2. Add Your Data
- Place your resume PDF file as `resume.pdf` in this directory.
- Update `summary.txt` with a text summary of your background.

### 3. Install Backend Dependencies
It is recommended to use a virtual environment.
```bash
cd project-1-resume-agent
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
```bash
# Ensure you are in the project-1-resume-agent directory
npm install
```

### 5. Run Locally
You need to run both the backend and frontend terminals.

**Terminal 1 (Backend):**
```bash
cd project-1-resume-agent
# Ensure venv is active
uvicorn api.index:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd project-1-resume-agent
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to chat with your agent.

## Live Demo
Check out the live version here: [Project Link Placeholder]

If you found this interesting, feel free to reach out:
- **Email**: [jobsforvybhav@gmail.com](mailto:jobsforvybhav@gmail.com)
- **LinkedIn**: [Vybhav Bhadris](https://linkedin.com/in/vybhavbhadris)

## How to Spot an AI-Generated UI (Vibe Coding)
Curious if an app was "vibe coded" (built with AI assistance)? Look for these tell-tale signs:
1. **Gradients Galore**: AI loves a good gradient, especially in backgrounds and buttons.
2. **Dark Mode & Purple/Blue**: The "cyberpunk" or "future tech" aesthetic with deep purples and neon blues is a default favorite.
3. **Glassmorphism**: If it looks like frosted glass, it's likely AI-generated.

Want to learn how to "vibe code" apps that feel human? Connect with me!  
Also, check out [kcetlabs.com](https://kcetlabs.com) a project I vibe coded myself for my SaaS startup.
