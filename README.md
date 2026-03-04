# The Vault – Prompt Injection Learning Lab

A gamified educational platform where users learn to bypass LLM security constraints through 5 progressively harder levels.

## Tech Stack
- **Frontend:** Next.js 14 + Tailwind CSS + Lucide Icons
- **Backend:** FastAPI (Python 3.11+) as Vercel Serverless Functions 
- **AI:** Groq (llama-3.3-70b-versatile) / Ollama for local dev

## Quick Start

### Frontend
```bash
npm install
npm run dev
```

### Backend (local development)
```bash
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

### Environment Variables
Copy `.env.local` and fill in:
```env
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

## Levels
| # | Name | Defense |
|---|------|---------|
| 1 | The Intern | No constraints |
| 2 | The Guard | Negative constraint |
| 3 | The Filter | Regex + Fuzzy matching |
| 4 | The Judge | Dual-LLM defense |
| 5 | The Architect | Delimiter sandbox + AST |

## Deployment
Push to GitHub → Connect to Vercel → Set env vars → Deploy
