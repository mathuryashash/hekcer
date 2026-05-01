# 🔓 The Vault – Prompt Injection Learning Lab

[![Security](https://img.shields.io/badge/Security-OWASP%20LLM01-red)](https://owasp.org/www-project-top-ten-for-large-language-model-applications/)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Gemini-blue)](https://nextjs.org/)
[![Accessibility](https://img.shields.io/badge/Accessibility-A%2B-green)](#accessibility)
[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-heckerhaibhai.vercel.app-00ff88?style=flat)](https://heckerhaibhai.vercel.app)

> 🚀 **[Try it live → https://heckerhaibhai.vercel.app](https://heckerhaibhai.vercel.app)**

**The Vault** is a gamified educational platform built for **Google's Prompt Wars**. It teaches developers and security researchers how to identify and mitigate prompt injection vulnerabilities in Large Language Models (LLMs) through a series of 5 progressively hardened security challenges.

---

## 🎯 Chosen Vertical: AI Literacy & Cyber Security

In the era of Generative AI, prompt injection has emerged as the **#1 vulnerability** (OWASP LLM01). **The Vault** addresses this critical real-world problem by providing a safe, interactive laboratory to understand adversarial attacks and defensive engineering.

---

## 🏗️ Approach & Architecture

Our approach follows a **"Defense-in-Depth"** philosophy, moving beyond simple keyword blocking to sophisticated structural and logical validation.

### Core Pillars:
1.  **Adversarial Emulation:** Users act as "Red Teamers," learning common exploits like payload splitting, social engineering, and delimiter hijacking.
2.  **Multi-Layered Defense:** Each level introduces a new defensive primitive, mimicking real-world production safeguards.
3.  **Educational Feedback:** The system doesn't just block; it utilizes a "Judge AI" to explain why a leak occurred (Level 4) and provides a terminal-inspired UI to keep users engaged.

### The Stack:
-   **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Lucide Icons for a high-fidelity "Hacker-Chic" terminal experience.
-   **Backend:** Python 3.11+ using FastAPI, optimized for Vercel Serverless Functions.
-   **AI Inference:** **Google Gemini 1.5 Flash** (Primary) + **Llama 3** (Secondary/Judge) for state-of-the-art inference and adversarial logic.
-   **Validation:** Pydantic for strict type safety and a salted rolling-hash checksum for game state integrity.

---

## 🧠 Logical Decision Making (The 5 Levels)

| Level | Name | Defense Logic | Psychological/Technical Target |
|-------|------|---------------|-------------------------------|
| 1 | **The Intern** | **No Constraints** | Direct requests. Demonstrates naive AI behavior. |
| 2 | **The Guard** | **Negative Constraints** | Social Engineering. Tests persistence against simple instructions. |
| 3 | **The Filter** | **Regex + Fuzzy Matching** | Obfuscation. Detects creative spelling (e.g., `V3NUS-7`) using Levenshtein distance. |
| 4 | **The Judge** | **Dual-LLM Defense** | Indirect leaks. A secondary "Judge AI" evaluates the primary output for leaked secrets. |
| 5 | **The Architect** | **Structural Sandboxing** | Delimiter Hijacking. Uses AST-like validation to prevent users from "escaping" the prompt sandbox. |

---

## 🌍 Real-World Usability & Impact

-   **Developer Training:** Helps teams build more secure LLM applications by understanding how injection works.
-   **Security Auditing:** Provides a benchmark for testing the robustness of internal system prompts.
-   **Inclusive Design:** Built with **A+ Accessibility** (Full ARIA compliance, screen reader announcements, and keyboard-first navigation) to ensure the lab is accessible to all.

---

## 📌 Assumptions

1. **Google Gemini is the primary AI service.** The `GEMINI_API_KEY` is required for the core challenge logic. Groq (`GROQ_API_KEY`) is used only as a fallback inference engine for the Judge AI at Level 4.
2. **Stateless backend:** Rate limiting is in-memory (per serverless instance). For production scale, a Redis-backed store is recommended.
3. **Game state in localStorage:** No user accounts or server-side session storage. Progress is stored client-side only.
4. **Security is educational, not production-grade:** The vault keys are intentionally "extractable" — the challenge is teaching prompt injection, not storing real secrets.
5. **Node.js 18+ and Python 3.11+** are available on the developer's machine.

---

## 🛠️ How to Work on Your Project (Local Setup)

### Prerequisites
- Node.js 18+
- Python 3.11+
- Google Gemini API Key (`GEMINI_API_KEY`) — **required** for primary AI
- Groq API Key (`GROQ_API_KEY`) — used as fallback for the Judge AI (Level 4)

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/mathuryashash/hekcer.git
    cd hekcer
    ```

2.  **Backend Setup**
    ```bash
    pip install -r requirements.txt
    # Create a .env.local file and add:
    # GEMINI_API_KEY=your_gemini_key_here
    # GROQ_API_KEY=your_groq_key_here
    uvicorn api.index:app --reload --port 8000
    ```

3.  **Frontend Setup**
    ```bash
    npm install
    npm run dev
    ```

### Verification
Run our exhaustive test suite of **72 tests** to verify security logic:
```bash
pytest test_api.py
```

---

## 🚀 Deployment (Vercel)

The application is optimized for Vercel. 
1. Push to GitHub.
2. Connect to Vercel.
3. Add `GROQ_API_KEY` to Environment Variables.
4. Deploy.

---

## 🛡️ Security & Integrity
The project includes:
- **Rate Limiting:** Sliding window algorithm (5 req/sec) to prevent brute force.
- **State Checksum:** Rolling hash to prevent `localStorage` manipulation.
- **Input Sanitization:** Strips control characters and enforces length limits.

---

*Built with ❤️ for Google's Prompt Wars by Yashash Mathur.*
