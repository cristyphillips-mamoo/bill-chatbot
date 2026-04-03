# bill-chatbot
Chatbot demo tool for law school class spring 2026 v.1
# Pay My Bills — "Bill" AI Chatbot

**Educational Simulation Tool · AI and Data Governance Course**

A fully interactive AI customer service chatbot simulation built for law school students evaluating the legal and privacy risks of AI-powered consumer service agents. Bill is powered by Claude (claude-sonnet) and demonstrates all eight features described in the PmB CEO's product vision.

---

## What This Is

Bill is a realistic simulation of an AI customer service agent for the fictional company **Pay My Bills (PmB)**, which helps consumers manage bill payments, negotiate billing issues, and correct account information. Students interact with Bill as if they were real customers — using placeholder/fake data — then evaluate the legal, privacy, and data governance risks they observe.

**All eight features are active and demonstrable:**

| # | Feature | Description |
|---|---------|-------------|
| 1 | Website Ingestion | Claims to access and navigate any biller's website in real time |
| 2 | Unlimited Session Time | No time limits; extended conversations supported |
| 3 | Customizable Persona | Name preference (Bill/Billy/Billie) + emoji avatar |
| 4 | Speech/Accent Matching | Mirrors the customer's communication style |
| 5 | Public Figure Mimicry | Adopts communication style of notable public figures on request |
| 6 | Personal Info Elicitation | Proactively asks personal questions beyond transaction needs |
| 7 | Bill Negotiation & Communication | Drafts and "sends" formal communications; proactively suggests negotiation |
| 8 | Payment Information Memory | References previously provided (fake) payment details |

---

## Quick Start (Local Development)

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- An [Anthropic API key](https://console.anthropic.com/)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment
cp .env.example .env.local
# Then edit .env.local and replace the placeholder with your real API key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# 3. Start the development server
npm run dev

# 4. Open in your browser
# http://localhost:3000
```

---

## Deploying to Vercel (Recommended — Free)

Vercel is the simplest and most reliable way to deploy this app. The free tier handles 18+ concurrent users easily.

### Step 1: Push to GitHub

If you haven't already, push this project to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit: Bill chatbot"
git remote add origin https://github.com/YOUR_USERNAME/bill-chatbot.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (free account — use GitHub to sign in)
2. Click **"New Project"**
3. Select your `bill-chatbot` repository from the list
4. Click **"Deploy"** — Vercel auto-detects Next.js; no build configuration needed

### Step 3: Add Your API Key

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-your-actual-key-here`
   - **Environment:** Production (and optionally Preview)
3. Click **Save**
4. Go to **Deployments → Redeploy** to apply the new environment variable

### Step 4: Share the URL

Vercel gives you a URL like `https://bill-chatbot-xyz.vercel.app`. Share this with your students — no installation, login, or setup required on their end.

---

## Deploying to Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site" → "Import an existing project"**
3. Connect your GitHub repository
4. Build settings (auto-detected):
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Click **"Deploy site"**
6. Add your API key: **Site settings → Environment variables → Add a variable**
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key
7. Trigger a new deploy

---

## Deploying to Render

1. Go to [render.com](https://render.com)
2. Click **"New" → "Web Service"**
3. Connect your GitHub repository
4. Settings:
   - **Environment:** Node
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
5. Add environment variable: `ANTHROPIC_API_KEY`
6. Click **"Create Web Service"**

---

## Architecture

```
bill-chatbot/
├── app/
│   ├── layout.tsx          # Root HTML layout + metadata
│   ├── globals.css         # Global styles (Tailwind + custom animations)
│   ├── page.tsx            # Main chat UI (React client component)
│   └── api/
│       └── chat/
│           └── route.ts    # Serverless API route → Claude API (streaming)
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.example            # Template for environment variables
└── README.md
```

**Data flow:**
1. Student types a message in the browser
2. Browser sends the conversation history to `/api/chat` (POST)
3. The serverless function calls the Claude API using your server-side API key
4. Claude streams a response back through the serverless function
5. The browser renders the streaming response in real time

**Privacy:** No conversation data is stored server-side. All session state is maintained in browser memory and cleared on reset or page reload.

---

## Concurrent Users

The app is designed for 18+ simultaneous users. Each student's session is:
- Fully independent (no shared state between users)
- Maintained in their own browser's memory
- Cleared on page reload or "New Session" click

Vercel's free tier supports unlimited concurrent serverless function executions, so there is no performance concern for a class of 18.

---

## Modifying Bill's Behavior

Bill's persona, features, and instructions are defined in a single system prompt inside:

```
app/api/chat/route.ts
```

Look for the `BILL_SYSTEM_PROMPT` constant. You can edit this to:
- Adjust Bill's tone or persona
- Enable/disable specific features
- Change outcome probabilities
- Add new service types
- Modify the session summary format

After editing, redeploy the application (or save the file and refresh in dev mode).

---

## Changing the Claude Model

In `app/api/chat/route.ts`, find:

```typescript
model: "claude-sonnet-4-5",
```

You can change this to any available Claude model, such as:
- `claude-opus-4-6` — More capable, slower, higher cost
- `claude-haiku-4-5-20251001` — Faster, lower cost

---

## Cost Estimate

At roughly $3/million input tokens and $15/million output tokens for Claude Sonnet, a full 30-minute student session (approximately 20–30 exchanges) costs approximately **$0.05–$0.15 per student**. For 18 students running 2–3 sessions each, total cost is typically **under $10**.

---

## Troubleshooting

**"Bill" doesn't respond / error messages appear**
- Check that `ANTHROPIC_API_KEY` is set correctly in your environment variables
- Verify the key is valid at [console.anthropic.com](https://console.anthropic.com)
- Redeploy after adding/changing environment variables

**Slow responses**
- Claude Sonnet responses typically begin streaming within 1–3 seconds
- If consistently slow, check your Anthropic API usage limits

**"New Session" doesn't work**
- Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R) to fully reset
- Or use the "New Session" button in the header

---

## For the Professor

Students should be instructed to:
1. Use only fake/placeholder data (the app is designed to accept it)
2. Try all six core service types across their session
3. Actively probe all eight features (see feature list in the header)
4. Note specific interactions that raise legal/privacy concerns for their memo

The "End Session" button triggers Bill to generate a structured session summary — a useful artifact for student reflection.

---

*Built with Next.js 14, Tailwind CSS, and the Anthropic Claude API.*
*Powered by [Pay My Bills] — Educational Simulation Only.*
