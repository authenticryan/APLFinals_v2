# IPL Stadium Companion

> A smart, AI-powered stadium management companion for IPL match attendees — built on Google Cloud, Firebase, and Gemini AI.

---

## Problem Statement

Managing 50,000+ attendees at an IPL match involves fragmented, manual processes: paper passes checked at gates, no pre-arrival coordination, ad-hoc food queues, and security briefings that are generic rather than personalised to each attendee's tier and access zone. High-profile attendees (VVIP, VIP, players) require tailored security protocols that can't be communicated effectively through printed literature.

**This app solves it** by giving every attendee — from VVIP to general public — a personalised digital companion that handles check-in, logistics, and security briefing in one place, before they walk through the gate.

---

## What It Does

The app covers the full attendee journey end-to-end:

1. **Ticket Authentication** — attendees enter their ticket number; the system loads their seat, tier, gate, and access profile
2. **Tiered Check-In Flow** — a 5-step guided process: tier confirmation → locker selection (real-time availability) → food pre-booking → rules acknowledgment → digital check-in confirmation
3. **AI-Powered Security Briefing** — Google Gemini 1.5 Flash generates a personalised briefing covering entry protocols, authorised movement zones, and emergency procedures specific to each attendee's security tier
4. **Tier-Specific Dashboards** — VIP/VVIP attendees see security escort requests, authorised zone chips, and priority directions; general public see gate navigation and seat wayfinding
5. **Security Escort Request** — Tier 1–4 attendees can request a physical escort, which is logged to Firestore in real time with a unique reference number

### Security Tiers

| Tier | Category | Security Authority |
|---|---|---|
| 1 | VVIP (Presidential Suite) | Special Protection Group (SPG) |
| 2 | VIP & International Dignitaries | State Special Branch + CAPF |
| 3 | Players & Support Staff | Franchise SLOs + Team Integrity Officers |
| 4 | Sponsors, Press & Stadium Staff | Private Turnkey Managers + Local Police |
| 5 | General Public | General stadium security |

---

## Functional Fulfillment

The prototype solves the core problem across three dimensions:

**Personalisation at scale** — rather than a one-size-fits-all briefing, every attendee's experience is generated from their specific data: seat, gate, access zones, security authority, and verification protocol. Gemini 1.5 Flash is prompted with structured ticket data and returns a natural-language brief tailored to that individual.

**Operational logistics** — locker assignment is tracked in real time via Firestore, preventing double-booking. Food orders are pre-captured before the match to reduce queuing. Escort requests are persisted with timestamps and reference numbers for security team pickup.

**Graceful offline fallback** — when Firebase is unavailable, all operations fall back to `localStorage` transparently. The entire check-in flow and dashboard remain fully functional. This also means the app runs in demo mode with zero backend configuration, making it evaluable without any setup.

---

## Scalability & Security

### Scalability

| Concern | Approach |
|---|---|
| Frontend scaling | Stateless React SPA — served from CDN or nginx, zero server-side state |
| Database scaling | Firebase Firestore — horizontally scalable NoSQL, built for concurrent writes |
| Container hosting | Google Cloud Run — auto-scales from zero to thousands of instances on demand |
| Session state | `sessionStorage` (per-tab, not persisted to server) — no sticky sessions needed |
| Concurrent locker booking | Firestore document-level writes; each locker is a separate document — no table-lock contention |

For a live deployment, Firestore Security Rules would enforce tier-based document access (e.g., only SPG-tier users can read Tier 1 escort requests), and Cloud Run can be placed behind a Google Cloud Load Balancer to handle match-day traffic spikes.

### Security

- **No credentials in code** — all API keys are injected via environment variables at build time (`VITE_` prefix for Vite, Docker `--build-arg` for CI/CD)
- **Session-scoped user state** — user data lives in `sessionStorage`, not `localStorage`; it is cleared on tab close and on logout
- **Firebase fallback isolation** — the localStorage fallback is used only when Firebase is explicitly unconfigured, not as a silent failure mode
- **Input trust boundaries** — ticket lookup is against a local static dataset (demo) or Firestore; there is no raw query construction from user input
- **No PII transmitted** — the Gemini prompt contains only ticket metadata (name, tier, seat, gate); no phone numbers or financial data are sent to the AI

---

## Google AI SDK Usage

### `@google/generative-ai` (Gemini)

The app uses the official Google Generative AI JavaScript SDK to call **Gemini 1.5 Flash**:

```js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent(prompt);
```

The prompt is structured with explicit attendee profile fields so Gemini can generate a grounded, factually accurate briefing rather than a hallucinated one. Output is instructed to be plain-text paragraphs (no markdown) for clean UI rendering.

**Demo mode** — if the API key is missing or unprefixed, the component renders a static placeholder brief. The UI is fully functional in either state.

### `firebase` (Firestore)

The official Firebase JS SDK is used for:
- `getFirestore`, `doc`, `getDoc`, `setDoc`, `updateDoc` — locker availability and assignment
- `addDoc`, `serverTimestamp` — escort request logging with server-side timestamps
- `getDocs`, `collection` — seeding and reading locker state

All Firebase calls are wrapped with try/catch and fall back to localStorage, so the app never hard-crashes on a Firestore error.

---

## Code Quality

```
src/
├── services/          # All external API calls (Firebase, Gemini) isolated here
│   ├── firebase.js    # Firestore helpers + localStorage fallback layer
│   └── geminiService.js  # Prompt construction + Gemini SDK call
├── context/
│   └── AppContext.jsx  # Single source of truth; sessionStorage sync on every update
├── data/
│   ├── tickets.js     # Ticket records + tier config constants
│   ├── foodMenu.js    # Menu items + order total helper
│   └── stadiumRules.js
├── components/        # Presentational components, no direct API calls
└── pages/             # Route entry points only — delegate to components
```

Key patterns:
- **Service layer** — Firebase and Gemini calls are never made directly from components; all go through `services/`
- **Fallback-first design** — every external call has a documented, tested fallback path
- **Single context** — all mutable app state lives in `AppContext`; components read and write through named actions (`login`, `logout`, `updateCheckin`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| UI components | Material UI v5 |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Database | Firebase Firestore |
| PWA | `vite-plugin-pwa` + Workbox (offline asset caching) |
| Container | Docker (multi-stage: Node 20 builder → nginx 1.27 Alpine) |
| Hosting | Google Cloud Run |

---

## GCP Deployment

The app is containerised and Cloud Run-ready out of the box.

### Build and deploy

```bash
# Build the Docker image (API keys injected at build time as Vite env vars)
docker build \
  --build-arg VITE_FIREBASE_API_KEY=<key> \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=<domain> \
  --build-arg VITE_FIREBASE_PROJECT_ID=<project> \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=<bucket> \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=<id> \
  --build-arg VITE_FIREBASE_APP_ID=<appid> \
  --build-arg VITE_GEMINI_API_KEY=<key> \
  -t gcr.io/<PROJECT_ID>/ipl-companion .

# Push to Google Container Registry
docker push gcr.io/<PROJECT_ID>/ipl-companion

# Deploy to Cloud Run
gcloud run deploy ipl-companion \
  --image gcr.io/<PROJECT_ID>/ipl-companion \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080
```

The nginx config handles SPA routing (all paths rewrite to `index.html`) and serves on port 8080 as required by Cloud Run. The multi-stage Dockerfile keeps the final image under 25 MB (nginx Alpine base + static assets only — no Node.js runtime in production).

### Cloud Build (CI/CD)

```bash
gcloud builds submit \
  --tag gcr.io/<PROJECT_ID>/ipl-companion \
  --substitutions _VITE_GEMINI_API_KEY=<key>,...
```

---

## Local Setup

```bash
git clone <repo-url>
cd GoogleAIFinal
npm install
cp .env.example .env    # add your Gemini + Firebase keys (or leave blank for demo mode)
npm run dev             # → http://localhost:5173
```

### Demo ticket numbers (no Firebase needed)

| Ticket | Name | Tier |
|---|---|---|
| `IPL-VVIP-001` | Aarav Shah | VVIP |
| `IPL-VIP-003` | Rahul Mehta | VIP |
| `IPL-PLY-005` | Vikas Kumar | Player |
| `IPL-SPR-007` | Neha Sharma | Press |
| `IPL-GEN-009` | Amit Joshi | General |

All 12 tickets: `IPL-VVIP-001/002`, `IPL-VIP-003/004`, `IPL-PLY-005/006`, `IPL-SPR-007/008`, `IPL-GEN-009/010/011/012`

---

## License

MIT
