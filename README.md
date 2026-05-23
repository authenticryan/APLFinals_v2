# IPL Stadium Companion

A secure digital companion for IPL cricket match attendees. Handles ticket authentication, guided stadium check-in, locker and food pre-booking, and AI-generated personalised security briefings — all tiered by seat category from VVIP to General Public.

Built with React + Vite, Material UI, Firebase Firestore, and Google Gemini 1.5 Flash. Deployable as a PWA or Docker container on Google Cloud Run.

---

## Features

- **Ticket authentication** — enter any of the 12 pre-seeded demo ticket numbers to log in
- **5-tier security system** — VVIP, VIP, Players, Press/Sponsors, General; each tier gets a distinct dashboard and access-zone profile
- **Guided check-in flow** — locker selection (real-time via Firestore), food pre-booking, stadium rules acknowledgment, and a digital check-in confirmation
- **AI security briefing** — personalised entry protocols, zone movement rules, and emergency procedures generated live by Gemini 1.5 Flash
- **Escort request** — VIP/VVIP tiers can request a physical security escort, logged to Firestore
- **Offline-first** — all Firebase calls fall back to `localStorage` automatically when credentials aren't configured; the full flow works in demo mode with zero backend setup
- **PWA** — installable on mobile/desktop, assets cached for offline use

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + Vite |
| Component library | Material UI v5 |
| State / session | React Context + `sessionStorage` |
| Database | Firebase Firestore (optional; falls back to `localStorage`) |
| AI | Google Gemini 1.5 Flash via `@google/generative-ai` |
| Routing | React Router v6 |
| PWA | `vite-plugin-pwa` + Workbox |
| Container | Docker (multi-stage) + nginx |
| Hosting | Google Cloud Run (port 8080) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Install and run locally

```bash
git clone <repo-url>
cd GoogleAIFinal
npm install
cp .env.example .env     # fill in your keys (or leave blank for demo mode)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment variables

Copy `.env.example` to `.env` and fill in your values. Both services are optional — the app runs in demo mode without them.

```env
# Firebase (optional — falls back to localStorage)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Google AI / Gemini (optional — shows a static briefing in demo mode)
VITE_GEMINI_API_KEY=
```

Get a Gemini key at [aistudio.google.com](https://aistudio.google.com/app/apikey). Get Firebase credentials from the Firebase console under **Project Settings → Your apps → Web app config**.

---

## Demo Tickets

The app ships with 12 pre-seeded tickets. Use any of these at the login screen:

| Ticket number | Holder | Tier |
|---|---|---|
| `IPL-VVIP-001` | Aarav Shah | VVIP — Presidential Suite |
| `IPL-VVIP-002` | Priya Kapoor | VVIP — Presidential Suite |
| `IPL-VIP-003` | Rahul Mehta | VIP — Hospitality Box |
| `IPL-VIP-004` | Sunita Patel | VIP — Hospitality Box |
| `IPL-PLY-005` | Vikas Kumar | Player — Dressing Room |
| `IPL-PLY-006` | Anil Singh | Player — Dressing Room |
| `IPL-SPR-007` | Neha Sharma | Press — Media Centre |
| `IPL-SPR-008` | Ravi Gupta | Sponsor — Pavilion |
| `IPL-GEN-009` | Amit Joshi | General — Stand A |
| `IPL-GEN-010` | Kavya Nair | General — Stand B |
| `IPL-GEN-011` | Suresh Rao | General — Stand C |
| `IPL-GEN-012` | Meena Das | General — Stand D |

All tickets are for **MI vs CSK** at Wankhede Stadium, Mumbai.

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # Ticket entry and phone auth screens
│   ├── checkin/       # Multi-step check-in flow (locker, food, rules, confirmation)
│   ├── common/        # AppLayout, TierBadge
│   └── dashboard/     # VIPDashboard, GeneralDashboard, AISecurityBriefing
├── context/
│   └── AppContext.jsx  # Global state (current user, check-in data, session persistence)
├── data/
│   ├── tickets.js     # 12 demo tickets + tier config
│   ├── foodMenu.js    # Pre-bookable food items
│   └── stadiumRules.js
├── pages/             # AuthPage, CheckinPage, DashboardPage
├── services/
│   ├── firebase.js    # Firestore helpers with localStorage fallback
│   └── geminiService.js # Gemini prompt + API call
└── theme.js           # MUI theme
```

---

## Building for Production

### npm

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

### Docker

```bash
docker build \
  --build-arg VITE_FIREBASE_API_KEY=... \
  --build-arg VITE_GEMINI_API_KEY=... \
  -t ipl-companion .

docker run -p 8080:8080 ipl-companion
```

The multi-stage Dockerfile builds with Node 20 Alpine, then serves the static output via nginx on port 8080 (Cloud Run compatible).

### Deploy to Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/<PROJECT_ID>/ipl-companion
gcloud run deploy ipl-companion \
  --image gcr.io/<PROJECT_ID>/ipl-companion \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

---

## How the AI Briefing Works

When a Tier 1–4 attendee clicks **Generate My Security Briefing**, the app sends their ticket profile (tier, seat, gate, access zones, security authority, verification protocol) to Gemini 1.5 Flash. The model returns a personalised 4-paragraph brief covering:

1. Welcome and tier acknowledgement
2. Arrival and gate security protocol
3. Zone movement rules during the match
4. Emergency contacts and evacuation priority

Without a Gemini API key the component renders a static placeholder brief so the UI remains fully functional.

---

## License

MIT
