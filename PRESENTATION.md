# IPL Security Intelligence Platform — Presentation Copy

---

## SLIDE 1 — The Attack Surface

**HEADLINE**
120,000 people. One roof. Every threat vector, live.

**SUBHEADER**
An IPL Final is not just a sporting event. It is a geopolitical target.

**BODY**
- **Physical:** Convoy ambush, perimeter breach, crowd stampede, pitch invasion
- **Digital:** RF/GNSS jamming, rogue drone payloads, credential spoofing
- **Insider:** Counterfeit accreditation, match-fixing approaches, honey-trapping
- **Operational:** Six agencies, no shared situational picture, radio coordination failures

> The threat is not a single attack vector. It is the space between them.

---

## SLIDE 2 — What Getting It Wrong Looks Like

**HEADLINE**
The cost of one failure is measured in decades, not headlines.

**BODY**

| Incident | The Gap | The Cost |
|---|---|---|
| Munich 1972 | No perimeter, no armed guards | 11 athletes killed. Global security redesigned. |
| Lahore 2009 | Unsecured convoy route, escorts fled | 8 dead. International cricket banned from Pakistan for 10 years. |
| Manchester 2017 | Soft-target exit zone, no dispersal surveillance | 23 killed. Global stadium exit protocols overhauled. |
| Bengaluru 2024 | No crowd holding zones, no agency coordination | 11 dead. Stadium closed. Judicial inquiry. |

**CLOSING LINE**
A single kinetic incident at an IPL Final would trigger season cancellation, insurance collapse, and billions lost in broadcast and sponsorship revenue.

---

## SLIDE 3 — Security Classifications

**HEADLINE**
Not everyone in the stadium is the same problem.

**SUBHEADER**
Five tiers. Five threat profiles. Five completely different operational requirements.

**BODY**

| Tier | Who | Controlled By | Primary Threat |
|---|---|---|---|
| **VVIP** | Heads of State, PM-level | Special Protection Group (SPG) | Assassination, state-level espionage |
| **VIP** | Ministers, Foreign Dignitaries | State Special Branch + CAPF | Hostage-taking, targeted violence |
| **Player** | Athletes, Support Staff | Franchise SLOs + Integrity Officers | Match-fixing, honey-trapping, info leaks |
| **Press** | Media, Sponsors, Stadium Staff | Private Turnkey + Local Police | Insider exploitation, credential theft |
| **General** | 100,000+ ticketed public | State Police, Home Guards | Stampede, mass panic, ticket fraud |

> The architecture must serve all five simultaneously — without letting them collide.

---

## SLIDE 4 — User Flows Per Tier

**HEADLINE**
One platform. Five completely different journeys.

**SUBHEADER**
Built in React + Firebase — dual-app architecture serving both the crowd and the ops team.

**BODY**

**Citizen App (`/`)**
- **General public:** Ticket scan → digital check-in → locker assignment → food pre-booking → gate directions to seat
- **VIP/VVIP:** Same flow, plus → Gemini AI security briefing (personalised by tier and access zone) → one-tap escort request → real-time pickup confirmation

**Security Ops Centre (`/security/`)**
- **General officer:** Live 8-gate occupancy grid, entry queue management, incident flagging
- **VIP officer:** Escort request queue, accept/complete workflow, urgency detection
- **VVIP officer:** Full convoy tracking — 5-state status machine, ETA countdown, exposure risk alerts, gate clearance progression
- **Admin:** Full situational picture — all tiers, all gates, all threats, user management

> Role-based access. Real-time data. No shared screens, no information overflow.

---

## SLIDE 5 — The Non-Conventional Attack Vectors

**HEADLINE**
The threats your metal detectors won't catch.

**SUBHEADER**
And how the platform addresses them.

**BODY**

**Rogue Drones**
- Commercial UAS can carry explosive, chemical, or surveillance payloads over a 50,000-seat bowl
- Platform: Live drone scanner array status (4 detection nodes), real-time RF spectrum health monitoring, threat resolution workflow for security officers

**RF & GNSS Jamming**
- Signal jammers suppress communication across an entire stadium sector
- Platform: 6 RF band health monitors with live fluctuation — officers see degradation before the crowd does

**Credential Counterfeiting**
- Telangana 2023: A ring duplicated official barcodes onto blank press-pass templates sourced from an insider at the printing vendor. 68 passes seized.
- Platform: Dynamic time-bound QR tickets linked to verified identity; KYC-gated officer login with 6-stage biometric simulation

**Player Integrity (Match-Fixing / Honey-Trapping)**
- BCCI 2026 directive: Hotel room bans, mandatory movement logging, unannounced compliance audits
- Platform: Tier 3 officer queue tracks player-staff admission separately; PMOA zone separation enforced at Gate C

**Insider Threat**
- Every vendor, volunteer, and contractor is a potential vector
- Platform: RBAC staff roster with clearance levels (TOP SECRET → RESTRICTED), permission matrix, audit-ready add/edit/remove log

---

## SLIDE 6 — How Google Makes This Scale

**HEADLINE**
From one stadium to every stadium — without a single point of failure.

**SUBHEADER**
The architecture is stateless. Every layer scales independently.

**BODY**

**Firebase Firestore**
- Document-level concurrent writes — 100,000 locker assignments don't queue, they land simultaneously
- No table locks, no batch jobs, no downtime windows

**Google Cloud Run**
- Zero instances at 2am. Thousands at 7pm gate-open. No provisioning, no cost at idle.
- Deployed in `asia-south1` (Mumbai) — sub-40ms latency for Indian users

**Gemini 1.5 Flash**
- Generates a personalised security briefing per attendee — tier, seat, gate, access zones, authority contacts
- Not one briefing served to all. One briefing generated for each.

**PWA + Workbox (offline-first)**
- Service worker caches the full app shell — attendees complete check-in even inside a stadium with saturated cell towers

**The security model**
- No credentials in source code — all keys injected at build time via Docker ARG → ENV
- Session-scoped state, no PII transmitted to AI, Firestore rules enforce tier-based document access

> From 1 user to 1 billion: no re-architecture required. Just more Cloud Run instances.

---

## SLIDE 7 — Conclusion

**HEADLINE**
Security is a system problem. We built a system.

**SUBHEADER**
Not an app. An operational platform.

**BODY**

The IPL Final is the highest-density, highest-stakes event in Indian sport. It demands:
- A unified picture across six agencies and five security tiers
- Real-time response to kinetic, digital, and insider threats
- Infrastructure that never becomes the bottleneck

This platform delivers all three — built on Google Cloud, powered by Gemini, deployed in Mumbai, running at match-day scale from day one.

**CLOSING STATEMENT**
*When 120,000 people walk through the gate, every second of lag is a second of exposure. Google's infrastructure doesn't lag.*

---

## SPEAKER NOTES (OPTIONAL — NOT ON SLIDES)

- **Slide 1:** Open with the scale. Most people think of stadium security as gates and guards. Frame it as a multi-domain operational problem.
- **Slide 2:** The historical table lands hard. Let the numbers breathe. The Lahore line — "a decade of exile" — is the one people remember.
- **Slide 3:** The tier table is the anchor of the whole talk. Everything else flows from it.
- **Slide 4:** Demo moment — show the live app if possible. The dual-app architecture (citizen + security) on one URL is the technical differentiator.
- **Slide 5:** The Telangana credential ring is a real case. Use it. It makes the "digital solution to a physical problem" argument concrete.
- **Slide 6:** This is the Google slide. Connect every product to a real match-day constraint. Don't pitch features — pitch consequences of failure that Google infrastructure prevents.
- **Slide 7:** Short. Confident. Stop talking before they want you to.
