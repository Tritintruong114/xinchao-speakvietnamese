# Landing page snapshot (A2A)

Compact handoff for **XinChao** marketing site (`apps/landing-web`). Neo-brutal / street-smart tone. **Do not** reintroduce “offline-first”, “dead-zone guaranteed”, or “everything on-device” unless product truly matches—copy was aligned with **cloud / API-backed** features (OCR, AI, Supabase).

**See also:** `[dashboard-a2a.md](./dashboard-a2a.md)` (internal ops UI, same app).

---

## Stack & shell

- **Next.js 15** App Router; home under `(marketing)/layout.tsx`: `NavbarWrapper` → `main` → `FooterSection`.
- **SEO defaults** (`src/lib/seo.ts`): lifebuoy positioning; “street-tested, pocket-ready” (not offline-first).

---

## `/` — Home order


| Block               | Role                                                                                                                                                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HeroSection**     | Tag “The Traveler’s Lifebuoy”; H1 Speak Vietnamese / Survive / Connect; blurb + highlight “Built for real streets—not just classrooms.”; CTAs GET THE APP (`/#waitlist`), WATCH REEL; phone mockup with bubble **“Your pocket Vietnamese coach”**. |
| **MarqueeSection**  | Scrolling chips: Scan Menu, Street Slang, Bargain, Navigate, Order, Count change, Street signs, Survival audio.                                                                                                                                    |
| **USPSection**      | “The 3-NO Solution”: (1) Street-smart data, (2) **STREET-SMART. BLAZING FAST.** + Zap (speed/practical packs, no dead-zone promise), (3) Scan & Survive (OCR).                                                                                     |
| **ReviewSection**   | “Survival Stories” / illustrative traveler quotes (not verified endorsements); CTA Share your story → `/contact`.                                                                                                                                  |
| **WaitlistSection** | Email form → `POST /api/waitlist`.                                                                                                                                                                                                                 |


**Page metadata:** title “Survival Vietnamese for Travelers”; description mentions **pocket survival packs** + menu scanning; keywords include Vietnamese travel phrases.

---

## Global chrome

- **FooterSection:** brand blurb; tag **“STREET-TESTED & POCKET-READY”**; links (Survival Kit, scan, bargaining, pricing, contact); app store placeholders; line **63 provinces** (geography, not “offline everywhere”).
- **Navbar:** shared wrapper (routes like `/survival`, `/pricing`, `/contact`, etc.—confirm in `NavbarWrapper` if extending).

---

## Related marketing URLs (not on home but same site)

- `**/survival`** — Survival Kit feature bullets (slang, scanner, curated maps & pins, bargaining); no “100% offline” hero.
- `**/about**`, `**/privacy**`, `**/terms**`, `**/contact**`, `**/pricing**`, `**/cookie-policy**`, `**/team-member**` — standard pages; **privacy** states camera/ mic may be sent **encrypted** to backend/AI for features; no blanket “on-device only”.

---

## Out of scope on landing

- `**/dashboard/*`** is internal (auth, waitlist, library CRUD, pocket phrases)—not public marketing positioning.

---

*Last aligned with repo state: snapshot for agent-to-agent continuity; refresh if sections or compliance copy change.*