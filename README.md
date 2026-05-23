# IPL Stadium Companion + Security Ops Centre

> A full-stack, AI-powered stadium management platform for IPL match day — dual-app architecture covering both audience-facing check-in and a professional security staff operations centre. Built on Google Cloud, Firebase Firestore, and Gemini AI.

**Live URL:** `https://ipl-companion-983163235471.asia-south1.run.app`

**Presentation:** [IPL Security Intelligence Platform — Gamma Slides](https://gamma.app/docs/IPL-Security-Intelligence-Platform-dokaw0si0h5qnzi)

| Route | App |
|---|---|
| `/` | Citizen companion (ticket check-in, food booking, AI briefing) |
| `/security/` | Security Ops Centre (staff login, KYC, real-time ops dashboard) |
| `/user-management/` | RBAC staff roster management |

---

## Problem Statement

Managing 50,000+ attendees at an IPL match involves fragmented, manual processes: paper passes checked at gates, no pre-arrival coordination, ad-hoc food queues, and security briefings that are generic rather than personalised to each attendee's tier and access zone. High-profile attendees (VVIP, VIP, players) require tailored security protocols that can't be communicated effectively through printed literature.

Meanwhile, **security staff** operate with radio communication, paper rosters, and no unified situational awareness — no real-time gate occupancy, no convoy tracking, no digital threat monitoring.

**This platform solves both sides**: a citizen companion for every attendee, and a professional operations dashboard for every security officer.

---

## What It Does

### Citizen App (`/`)

1. **Ticket Authentication** — attendees enter their ticket number; the system loads their seat, tier, gate, and access profile
2. **Tiered Check-In Flow** — 5-step guided process: tier confirmation → locker selection (first-come-first-served via Firestore) → food pre-booking → rules acknowledgment → digital check-in confirmation
3. **AI-Powered Security Briefing** — Google Gemini 1.5 Flash generates a personalised briefing covering entry protocols, authorised movement zones, and emergency procedures specific to each attendee's security tier
4. **Tier-Specific Dashboards** — VIP/VVIP attendees see security escort requests and priority directions; general public see gate navigation and seat wayfinding
5. **Security Escort Request** — Tier 1–4 attendees can request a physical escort, logged to Firestore in real time

### Security Ops Centre (`/security/`)

1. **Biometric Auth** — phone number → OTP → simulated 6-stage KYC (badge scan, hash verification, CCTNS check, shift validation, duty roster, confirmation). Full dark-theme UI with animated progress
2. **Role-Based Dashboard** — each tier sees a tailored dashboard: VVIP gets convoy summary + critical alerts; VIP gets escort queue; General gets gate occupancy overview
3. **VVIP Convoy Manager** — full convoy tracking with 5-state status machine (assembling → en-route → gate-approach → clearing → admitted), ETA countdown, member list, gate clearance progress, exposure risk alerts, advance/halt actions
4. **Attendee Queue** — live queue management with admit/flag/process actions, 20s simulated arrivals, per-tier filtering
5. **Escort Requests** — tier-filtered escort list, accept/complete workflow, urgency detection (>8 min unassigned)
6. **Gate Management** — 8-gate real-time grid, capacity bars, overflow detection, Alert Staff / Divert / Close Gate actions, 8s live simulation
7. **Digital Threat Monitor** — drone detection with radar pulse animation (4 scanner arrays), RF signal health (6 bands with 5s fluctuations), cyber threat panel (signal jammer + intrusion attempts)
8. **Notification Centre** — priority-sorted (CRITICAL → LOW), read/unread state, tier filtering, mark-all-read

### User Management (`/user-management/`)

- Full security staff roster: view, add, edit, remove officers
- Role-based access control matrix (6 tiers × 6 permission types)
- Filter by tier, search by name/badge/gate/department
- Backed by `localStorage` fallback (Firestore `security_staff` collection in production)

### Security Tiers

| Tier | Category | Security Authority | Demo Phone |
|---|---|---|---|
| VVIP | Presidential / Head of State | Special Protection Group (SPG) | `+91 00001 00001` |
| VIP | Dignitaries / State Guests | State Special Branch + CAPF | `+91 00002 00002` |
| PLAYER | Players & Support Staff | Franchise SLOs + Integrity Officers | `+91 00003 00003` |
| PRESS | Media & Sponsors | Private Turnkey + Local Police | `+91 00004 00004` |
| GENERAL | General Public Security | State Police | `+91 00005 00005` |
| ADMIN | Ops Commander | Full system access | `+91 00006 00006` |

All demo OTPs: **123456**

---

## Google AI SDK Usage

### `@google/generative-ai` (Gemini 1.5 Flash)

Used in `src/services/geminiService.js` to generate personalised per-attendee security briefings:

```js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent(prompt);
```

The prompt is structured with attendee tier, seat, gate, access zones, and security authority. Output is instructed to be plain-text paragraphs (no markdown) for clean UI rendering.

**Demo mode** — if `VITE_GEMINI_API_KEY` is not set or set to `YOUR_GEMINI_API_KEY`, the component shows a static placeholder brief. Swap in a real key to activate live AI briefings.

### `firebase` (Firestore v10 Modular SDK)

- `getFirestore`, `doc`, `getDoc`, `setDoc`, `updateDoc` — locker availability, assignment, and gate metrics
- `addDoc`, `serverTimestamp` — escort request logging
- `getDocs`, `collection` — reading queue, convoy, and threat data

All Firebase calls are wrapped with `try/catch` + `localStorage` fallback — the entire app works in offline/demo mode with zero backend.

---

## Architecture

```
src/
├── App.jsx                      # Top-level BrowserRouter; splits / vs /security/* vs /user-management/*
│
├── pages/ + components/         # Citizen app (ThemeProvider: blue/gold)
│   ├── auth/                    # Ticket entry + phone OTP
│   ├── checkin/                 # 5-step stepper (Tier → Locker → Food → Rules → Done)
│   └── dashboard/               # GeneralDashboard / VIPDashboard + AISecurityBriefing
│
├── security/                    # Security Ops Centre (ThemeProvider: dark navy)
│   ├── SecurityApp.jsx          # Route: /security/*
│   ├── context/SecurityContext  # Officer state (sessionStorage)
│   ├── data/                    # securityStaff, gateData, convoyData, threatData
│   ├── services/securityDb.js   # Firebase + localStorage dual-mode
│   └── components/
│       ├── auth/SecurityAuth    # Phone → OTP → KYC 6-stage
│       ├── common/SecurityLayout# Sidebar + mobile bottom nav, role-aware
│       ├── dashboard/           # VVIPSecDashboard, VIPSec, PlayerSec, PressSec, GeneralSec, AdminSec
│       ├── convoy/              # ConvoyManager (status machine, ETA, exposure risk)
│       ├── queue/               # AttendeeQueue (live 20s arrivals)
│       ├── escorts/             # EscortRequests (accept/complete)
│       ├── gate/                # GateManagement (8s simulation)
│       ├── threats/             # ThreatMonitor (drone + RF + cyber)
│       └── notifications/       # NotificationCenter (priority sorted)
│
└── user-management/             # RBAC staff management (ThemeProvider: dark)
    ├── UserManagementApp.jsx
    ├── components/StaffTable, StaffForm
    └── pages/StaffListPage
```

---

## Code Quality

Key patterns:
- **Service layer isolation** — Firebase and Gemini calls never made directly from components; all routed through `src/services/` and `src/security/services/`
- **Fallback-first design** — every external call has a documented `localStorage` fallback path; app never crashes without Firebase
- **Real-time simulation** — `setInterval` + `useEffect` cleanup for gate metrics (8s), RF bands (5s), queue arrivals (20s), convoy ETA countdown (60s)
- **Role-aware rendering** — single `getNavItems(tier)` drives nav; `getQueue(tier)` / `getEscortRequests(tier)` filter data server-side
- **Dual theme architecture** — citizen app uses light blue/gold (`src/theme.js`); security app uses dark navy (`src/security/theme.js`); each wraps its own `ThemeProvider`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| UI components | Material UI v5 (light + dark themes) |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Database | Firebase Firestore v10 (modular SDK) |
| PWA | `vite-plugin-pwa` + Workbox (offline asset caching) |
| Container | Docker multi-stage (Node 20 Alpine builder → nginx 1.27 Alpine) |
| CI/CD | Google Cloud Build (`cloudbuild.yaml` with substitutions) |
| Hosting | Google Cloud Run (auto-scale, port 8080, asia-south1) |

---

## Deployment

### One-command deploy (Cloud Run from source)

```bash
gcloud run deploy ipl-companion \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-build-env-vars \
    VITE_FIREBASE_API_KEY=<key>,\
    VITE_FIREBASE_AUTH_DOMAIN=<domain>,\
    VITE_FIREBASE_PROJECT_ID=<project>,\
    VITE_FIREBASE_STORAGE_BUCKET=<bucket>,\
    VITE_FIREBASE_MESSAGING_SENDER_ID=<id>,\
    VITE_FIREBASE_APP_ID=<appid>,\
    VITE_GEMINI_API_KEY=<gemini-key> \
  --project <PROJECT_ID>
```

### Cloud Build (CI/CD via `cloudbuild.yaml`)

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions \
    _VITE_FIREBASE_API_KEY=<key>,\
    _VITE_FIREBASE_PROJECT_ID=<project>,\
    ... \
  --project <PROJECT_ID>
```

### Local setup

```bash
git clone <repo-url>
cd GoogleAIFinal
npm install
cp .env.example .env    # add your Gemini + Firebase keys (or leave blank for demo mode)
npm run dev             # → http://localhost:5173
```

---

## Demo Logins

### Citizen App

| Ticket | Name | Tier |
|---|---|---|
| `IPL-VVIP-001` | Aarav Shah | VVIP |
| `IPL-VIP-003` | Rahul Mehta | VIP |
| `IPL-PLY-005` | Vikas Kumar | Player |
| `IPL-SPR-007` | Neha Sharma | Press |
| `IPL-GEN-009` | Amit Joshi | General |

All tickets: `IPL-VVIP-001/002`, `IPL-VIP-003/004`, `IPL-PLY-005/006`, `IPL-SPR-007/008`, `IPL-GEN-009–012`
OTP: **123456** (any phone number)

### Security App (`/security/`)

| Phone | Officer | Tier | Features unlocked |
|---|---|---|---|
| `+91 00001 00001` | Supt. Arvind Menon | VVIP | Convoy Manager, all dashboards |
| `+91 00002 00002` | DSP Rajesh Sharma | VIP | Escort requests, VIP queue |
| `+91 00003 00003` | Insp. Pradeep Nair | Player | Player queue |
| `+91 00004 00004` | ACP Neeta Joshi | Press | Press queue |
| `+91 00005 00005` | SI Dinesh Kumar | General | Entry queue, gate overview |
| `+91 00006 00006` | Cmdr. Suresh Roy | Admin | Full access + User Management |

OTP: **123456** (simulated)

---

## License

MIT
