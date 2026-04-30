# NEXUS Student Portal

An AI-powered student workspace with career roadmaps, job discovery, smart notes, and a unified collection manager.

## Architecture

```
nexus/
├── client/          # React + Vite frontend (port 5173)
│   └── src/
│       ├── api/     # API client with demo-mode fallback
│       ├── components/
│       ├── context/ # AppContext, ChatContext
│       ├── demo/    # Bundled demo data (offline mode)
│       ├── hooks/   # useAgent, useChat
│       ├── pages/   # RoadmapPage, JobsPage, NotesPage, CollectionsPage
│       └── styles/  # tokens, global, app CSS
├── server/          # Express backend (port 3001)
│   ├── controllers/
│   ├── demo/        # Server-side demo JSON
│   ├── middleware/
│   ├── models/      # Mongoose schemas
│   ├── routes/
│   └── services/    # AI integrations, scraper, memory store
└── package.json     # Root workspace with concurrently scripts
```

## Quick Start (Demo Mode — no API keys needed)

```bash
git clone <repo-url>
cd nexus
npm run install:all
```

**Windows (PowerShell):**
```powershell
$env:VITE_DEMO_MODE="true"; npm run dev
```

**macOS / Linux:**
```bash
VITE_DEMO_MODE=true npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## With AI APIs

1. Copy the example env file:
   ```bash
   cp .env.example server/.env
   ```
2. Add your API keys to `server/.env`.
3. Start the app:
   ```bash
   npm run dev
   ```

## Scripts

| Command              | Description                                  |
|----------------------|----------------------------------------------|
| `npm run dev`        | Start server + client concurrently           |
| `npm run client`     | Start Vite dev server only                   |
| `npm run server`     | Start Express server only (with --watch)     |
| `npm run install:all`| Install root, client, and server deps        |
| `npm run build`      | Production build of the client               |

## Pages

| Route          | Agent      | Description                        |
|----------------|------------|------------------------------------|
| `/roadmap`     | Aristotle  | AI-generated career roadmaps (3D)  |
| `/jobs`        | Columbus   | Live job search + scraping         |
| `/notes`       | Athena     | Streaming markdown notes           |
| `/collections` | —          | Saved items from all agents        |

## Demo Mode

The app is designed to work fully offline in demo mode:

- Set `VITE_DEMO_MODE=true` as an environment variable, **or**
- Simply start without API keys — the client auto-falls back to bundled demo data when the server is unreachable.
- The server also returns demo data when no AI API keys are configured.

## Tech Stack

- **Frontend:** React 18, Vite, Framer Motion, React Three Fiber, Lucide Icons
- **Backend:** Express, Mongoose, Anthropic SDK, Groq SDK, OpenAI SDK
- **Database:** MongoDB (optional — uses in-memory store when unavailable)
