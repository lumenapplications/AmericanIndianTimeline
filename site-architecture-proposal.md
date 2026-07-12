# The Pattern — Website Architecture Proposal

**Date:** 2026-07-11 · **Status:** FOR APPROVAL — no code until signed off.
**Sources ingested:** record-timeline.html (full data audit + all page content) · the-pattern.pdf (74 pp) · Context Document · Legal Classification Thread

---

## 0. Source-of-truth rulings established during ingestion

These are facts the build follows, found during ingestion — listed so they're on the record:

1. **Data is used as-is** from record-timeline.html: `D[]` (37), `CONNECTIONS` (63), `ESSAYS{}` (4), `RD{}` (37, keyed by `n.y` long-form — lookup must use `n.y`, not `n.s`). Also carried over: `MAPS{}` (map images + modal for cartographic nodes) and the 21-term glossary (Legal Doctrine 9 / Historical 6 / Analytical 6).
2. **"364 years" always means the 1662→2026 reclassification chain**, never the full timeline span (which opens at 14,000+ BCE). Essay copy is not edited (data as-is), but all *new* microcopy follows this rule.
3. **Stale copy corrected in rebuild:** "33 nodes" (web description) and "32 Timeline Points" (research sidebar) → 37.
4. **1924 alert names the Racial Integrity Act explicitly** (not the Indian Citizenship Act, also 1924) in any new chain microcopy.
5. **Three-tier epistemic labeling preserved everywhere:** documented / developing argument (Essay Four's labels kept verbatim) / removed claims never appear.
6. **Footer/license text verbatim** from current site: "© 2025 Maxwell Edridge. All rights reserved. Research compilation — historical and legal information only. Not legal advice." + CC BY-NC-ND 4.0 line. On every page.
7. **New microcopy follows the Edridge voice rules** (Context Doc): short declaratives, 2–3 sentence paragraphs, no "delve/leverage/robust," max one em-dash per passage, authority from the record.
8. **Sovereign-citizen guardrail:** nothing in navigation, microcopy, or UI framing may present the material as a personal legal strategy. It is documentation.

---

## 1. Open decisions (need your ruling — asked separately)

| # | Question | Recommendation |
|---|---|---|
| A | Background + palette source of truth: brief says `#0a0805`, approved asset audit says `#0d0a06` with full token set | **`#0d0a06` audit tokens** — assets were generated against it; the two hexes are visually indistinguishable but the audit tokens carry the whole derived system (text-safe semantic variants, rules, scrims) |
| B | Longform body face: audit approved EB Garamond (archive register); new brief says "clean sans-serif" body | **Split register:** EB Garamond for essays/longform (the archive), clean sans for data surfaces (timeline, research, UI) — mission control and reading room are different rooms |
| C | Alert node set in the Unbroken Chain: brief says 1830/1832/1848/1924; PDF caps-alerts 1830/1848/1924; current site alerts 1848/1924/2026 | **1830, 1831–1832, 1848, 1924 as amber alerts** + 2026 Callais styled as the chain's live terminus (red-hot, "present tense" treatment) — superset honoring the brief |
| D | Chain scope: brief says all 37 reveal sequentially; PDF Part 1 is a curated 15; current site has 11 | **All 37 from `D[]`** — the brief is explicit, and the full chain is the strongest version of "watching a trap close slowly" |

---

## 2. Component inventory

**Shell (all pages)**
| Component | Notes |
|---|---|
| Top nav | `Home · The Pattern · Essays · Timeline · Research` — fixed, thin, letter-spaced small caps; active state gold underline; mobile: collapses to icon row (no hamburger drawer needed for 5 items) |
| Hash router | `#/`, `#/pattern`, `#/essays`, `#/essays/:key`, `#/timeline`, `#/research`, deep links incl. `#/timeline?node=1682` — back button works, GH Pages safe |
| Glossary FAB | Fixed bottom-left, mono label "GLOSSARY"; opens drawer |
| Glossary drawer | Slide-in from left (per new brief; current site slides right — brief wins), search field, 3 grouped sections, 21 expandable terms, ESC/overlay close, focus trap |
| Footer | Verbatim legal text, both lines, every page |
| Divider component | The 3 ornamental dividers as CSS backgrounds between major sections (rotating by section) |
| Scroll progress hairline | 1px gold top-of-viewport progress bar on longform pages |

**Home**
| Component | Notes |
|---|---|
| Cover | Full viewport; hero-reading-room.png behind bottom-up scrim; "Something has always felt off." word-by-word; pulse element resolving to "364 YEARS. ONE CONTINUOUS LINE."; CTA `ENTER THE RECORD →` → `#/pattern` |
| Founding essay | Part Zero essay verbatim from current Home, with scroll reveals per section, `hm-aside` callouts styled as marginal stamps, 16-citation block, end CTA |

**The Pattern** (8 sections in order)
| Component | Notes |
|---|---|
| Pattern hero | Text-first (no image) — the record speaks |
| Decision cards ×5 + CTA card | Fade-up stagger; Go Deeper expanders preserved |
| Then vs. Now ×6 | Then/Now columns; **flip-to-reveal Hidden Connection** on interaction (brief); reflection quote; Go Deeper |
| Doubling-down steps ×5 | Steps "count themselves in" — number draws, connector arrow draws downward |
| **Unbroken Chain** | The cinematic — full spec §5 |
| Happening Now ×6 | Global/U.S./Culture tags; reveals; Go Deeper |
| The Pen | Era timeline (Ancient→Today) with essay-01 opener image as section header art; insight block |
| Application ×8 + Closing | Action cards; closing frame "You Are the Key" with essay-04 threshold image; final CTAs |

**Essays**
| Component | Notes |
|---|---|
| Essay index | 4 cards with the 4 opener images as card art; number, label, title, description, tags |
| Reader view | Opener image as chapter header (per-essay), title/subtitle over it; ESSAYS[key].html injected; key-sentence reveals; pull-quote enlargement; citation superscripts → hover/tap footnote tooltips; binary essay gets the two-forces geometric interstitial (pure CSS/SVG, cream+gold, echoing essay-03 image); Essay Four's developing-argument labels rendered as visually distinct framed sections |

**Timeline**
| Component | Notes |
|---|---|
| Thesis bar | Verbatim thesis text |
| View toggle | Pattern Web (default) / Linear |
| Filter bar ×5 | They Named Us / They Signed the Treaties / Then They Took It Back / The Maps Knew / The Pattern Repeats — stackable toggles |
| **Pattern Web** | Three.js scene — full spec §4; backdrop-oculus-dome.png + CSS vignette behind canvas |
| Node detail panel | Slides from right (desktop) / bottom sheet (mobile); frame-node-detail.png treatment; full `sc[]` content, tags, connection list (clickable), map button when `MAPS[n.s]` exists |
| Linear view | Chronological list, category key, same detail panel |
| Map modal | Preserved from current site |

**Research**
| Component | Notes |
|---|---|
| Search field | Free-text over label/title/`RD` content |
| Filters | Category (4) + connection type (5) |
| Node grid/sidebar | 37 entries, category-coded; declassified-file styling (mono headers, stamp-like labels) |
| Detail view | Full `RD` fields: thesis-connection lead, `wo/ps/rc/ap/tc/cp/cites` |

---

## 3. Site architecture

```
index.html          ← single self-contained file (~500KB): CSS + data + all JS inline
assets/             ← the 10 approved images (+ web derivatives, see below)
```

- **Libraries via CDN** (GH Pages compatible, no build): Three.js r160 (module build), GSAP 3 + ScrollTrigger, D3 (d3-force only). Pinned versions, `defer`.
- **Data pipeline:** `RD`, `D`, `CONNECTIONS`, `ESSAYS`, `MAPS`, glossary HTML extracted **verbatim** from record-timeline.html by the same slicing method used in the audit (byte-identical blocks pasted into the new file). No restructuring; new code adapts to the data, never the reverse.
- **Rendering model:** all five pages live in the DOM; hash router toggles visibility (matches current site, zero-latency nav). ScrollTrigger contexts created/killed per page activation.
- **Images:** masters stay out of the web root; site ships WebP derivatives generated in the pre-build step from the audit (§ pre-build checklist), hero preloaded, everything else lazy.
- **Performance budget:** < 800KB critical path (HTML + fonts + hero WebP), 60fps scroll on desktop, 30fps floor on mid-tier mobile in the web view.
- **Accessibility:** `prefers-reduced-motion` collapses all cinematics to fades; keyboard nav for web view (arrow through nodes chronologically); focus management in drawer/panels; WCAG AA text contrast via audit's `-text` tokens.

---

## 4. Three.js Pattern Web scene

**Stack:** Three.js renders; d3-force computes layout in 3D (custom z-jitter on a 2.5D layout — full 3D positions from force sim with z compressed ×0.4 so the graph reads as a constellation with depth, not a ball).

**Scene graph**
- `WebGLRenderer` alpha, antialias, DPR clamped 1.75 desktop / 1.5 mobile; CSS layers behind canvas: `#0d0a06` → backdrop-oculus-dome (centered, 60% opacity) → radial vignette (audit §4.2 fix).
- **37 nodes:** `SphereGeometry(r by connection degree, 3 tiers)`; material emissive in category color; each node carries an additive-blend sprite halo (canvas-generated radial gradient) — the glow, without postprocessing cost. Alert-set nodes get a second halo with a 2.4s scale/opacity pulse (GSAP, sine ease — pulse, never flash).
- **63 connections:** curved paths (`QuadraticBezierCurve3`, midpoint lifted off-plane), rendered as line segments in the connection-type color at 35% opacity, additive. **Particle flow:** one shared `Points` buffer (~8 particles per edge, ~500 total); each particle advances along its curve by `(t + time × 0.02) % 1` — slow, directional, from-source-to-target. Mobile: 3 per edge.
- **Labels:** year (`s`) as manually-projected DOM elements — mono type, only visible for hovered/selected/filter-active nodes + the alert set (always). No CSS2DRenderer dependency.

**Layout:** d3-force (link distance by type, charge −180, weak radial-by-century force so deep past sits outer ring, present sits center — the chain closes inward). Sim runs 250 ticks during the page's entry fade (~700ms), then freezes; positions cached in sessionStorage so revisits are instant.

**Camera & interaction**
- `PerspectiveCamera` with damped custom orbit (drag/touch), no zoom below min-distance; slow idle drift (4°/min) when untouched.
- **Node click:** raycast → GSAP camera tween (1.2s, power2.inOut) to a position framing node + its neighbors → detail panel slides in. Panel back-button and ESC reverse it.
- **Filters:** toggling builds active node/edge sets; inactive material opacity tweens to 0.08, active edges brighten to 0.9 + particle speed ×1.5 on the active thread only; camera tweens to the active subgraph's bounding sphere (1.4s). Stackable = union of sets.
- **Linear toggle** cross-fades canvas out, list in; same detail panel component both views.

**Fallback:** WebGL unavailable → linear view auto-selected with a one-line notice. `prefers-reduced-motion`: no idle drift, no particles, camera cuts instead of tweens.

---

## 5. GSAP scroll sequence — The Unbroken Chain

**Structure:** all 37 nodes from `D[]`, vertical chain, center rail on desktop / left rail mobile.

**Beats**
1. **Section header:** "364 Years." then "One Continuous Line." fade up; a mono counter runs 1662→2026 alongside a 1px gold rail that begins drawing down. Header note anchors the frame: *the chain is 1662→2026; the record behind it goes back 14,000 years.*
2. **Pre-chain prologue:** the first 5 nodes (14,000+ BCE→1660) reveal as a compressed, quieter register — the world before the chain. Visual shift (cream text, wider spacing) marks 1662 as the chain's first link.
3. **Per node** (ScrollTrigger, `start: top 78%`, one-shot): year stamps in (mono, 0.6s fade-up) → category badge in its color → connector line draws from previous node (scaleY from top, 0.9s power1.out, gold at 35%) → title/text fades up (0.15s stagger). No two nodes animate simultaneously — sequential feel enforced by trigger spacing.
4. **Alert nodes (1830, 1831–1832, 1848, 1924):** amber halo pulses on arrival (2.4s repeating, sine); their alert phrases surface in caps-mono ("THE SYSTEM KNEW IT WAS WRONG", "PAPER GENOCIDE" — PDF Part 1's own labels).
5. **Primary-source quotes:** at 8 stations (1662, 1682, 1787, 1830/Jackson "fell still born", 1848/O'Neall, 1871/preservation clause, 2020/Gorsuch "we hold the government to its word", 2026/Kagan "all but a dead letter") a full-bleed pull quote in EB Garamond italic scrolls into view between links, source-cited in mono.
6. **2026 terminus:** Callais node in statute-red heat; the rail continues past it to a **"Today" coda** (kept from current site) — "The chain has no break." holds center screen for a full viewport before releasing to the next section.
7. **Node click:** expands accordion with full `sc[]` detail inline (no navigation away mid-cinematic).

**Weight rules (site-wide GSAP defaults):** durations 0.8–1.4s; eases `power1.out`/`power2.out` only; no elastic/back/bounce anywhere; text = fade-up 16px, never slide-in; lines always draw; stagger ≥ 0.12s. `prefers-reduced-motion`: all triggers fire as instant opacity sets.

---

## 6. Typography (pending ruling B)

| Role | Face | Notes |
|---|---|---|
| Display | **Cinzel** | Uppercase, letter-spaced — the engraved-record register |
| Longform (essays, quotes) | **EB Garamond** (if B approved) | 1.125rem+, lh 1.65, 68ch measure |
| Body/UI on data pages | Clean geometric sans (Josefin Sans for labels; body text at readable weights) | "Mission control" register |
| Dates, citations, badges, filters | **DM Mono** | Current site already uses it — continuity; all years/cites/stamps |

Fonts self-hosted subsets, ~150KB budget, 2 weights above the fold.

---

*Approval gate: rulings A–D plus overall sign-off, then code begins.*
