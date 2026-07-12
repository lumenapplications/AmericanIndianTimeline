# The Pattern — Asset Audit & Front-End Foundations

**Date:** 2026-07-11
**Status:** FOR REVIEW — website build begins after sign-off.
**Asset location:** `/Users/morganedwards/The Pattern/assets/`
Every asset below was visually inspected in its final saved form for this audit.

---

## 1–3. Asset inventory

| # | Asset | File | Actual dimensions | Spec | File size |
|---|---|---|---|---|---|
| 1 | Hero — Reading Room | `hero-reading-room.png` | 5504 × 3072 | ≥2560×1440 ✓ | 34.9 MB |
| 2 | Backdrop — Oculus | `backdrop-oculus-dome.png` | 2048 × 2048 | 2048×2048 ✓ | 8.7 MB |
| 3 | Divider — Golden Spiral | `divider-01-golden-spiral.png` | 2400 × 400 | 2400×400 ✓ | 1.1 MB |
| 4 | Divider — Hex Lattice | `divider-02-hex-lattice.png` | 2400 × 400 | 2400×400 ✓ | 1.1 MB |
| 5 | Divider — Star Polygon | `divider-03-star-polygon.png` | 2400 × 400 | 2400×400 ✓ | 1.3 MB |
| 6 | Essay 1 — The Pen | `essay-01-pen-institution.png` | 1600 × 1000 | 1600×1000 ✓ | 2.4 MB |
| 7 | Essay 2 — Way of Scale | `essay-02-way-of-scale.png` | 1600 × 1000 | 1600×1000 ✓ | 2.9 MB |
| 8 | Essay 3 — Before the Binary | `essay-03-binary-beginning.png` | 1600 × 1000 | 1600×1000 ✓ | 2.4 MB |
| 9 | Essay 4 — The Threshold | `essay-04-next-steps.png` | 1600 × 1000 | 1600×1000 ✓ | 2.5 MB |
| 10 | Node Detail Frame | `frame-node-detail.png` | 1200 × 800 | 1200×800 (600×400 @2x) ✓ | 1.1 MB |

All dimensions match spec. All files are PNG masters.

---

## 4. Assets needing adjustment

None require regeneration. Five need handling in the build (CSS/post-processing, not new images):

**4.1 Hero — brighter than the page base, busy lower third**
The hall reads midtone (cream/gold dominant), not `#0d0a06`-dark, and the lower-center is full of desks — the "calm text zone" from the brief didn't survive into the photographic version.
*Fix in build:* bottom-up gradient scrim (`linear-gradient(to top, #0d0a06 0%, transparent 45%)`) behind the overlaid title, plus a subtle full-frame darkening overlay (~15–25%) so the hero blends into the page. This is standard hero treatment and keeps the photograph honest.

**4.2 Backdrop — bottom edge breaks the fade-to-black**
The bottom ~20% shows lit stone masonry; the brief requires all edges to recede to near-black so graph nodes pop.
*Fix in build:* CSS radial vignette overlay (`radial-gradient(circle at center, transparent 35%, #0d0a06 85%)`) on the layer above the image, below the graph canvas. Cheaper and more controllable than regenerating; also future-proofs any crop.

**4.3 Essay 1 — bright lamp intrudes at top-center**
The light source (glowing lamp shade) crosses the top edge. Photographically honest, but it will fight a chapter title placed at the top of the banner.
*Fix in build:* place the essay title in the lower half, or crop the top ~10% at display time (`object-position: center 65%`). No regen needed.

**4.4 Essay 2 — thin film-border artifact**
A faint dark scan-border rings the frame (part of the photographic treatment). Invisible on the dark page background; would only show if ever placed on a light ground.
*Fix in build:* none needed on `#0d0a06`. If it ever bothers us: 1–2% inset crop.

**4.5 Node frame — opaque ground, and it must overlay the live graph**
The frame's exterior ground is a dark green-black that is close to but not exactly `#0d0a06`, and the interior is opaque dark brown. As a plain `<img>` over the graph its rectangle will visibly mask the nodes behind it.
*Fix in build (choose at build time):*
- (a) Alpha-cut the exterior + interior (`remove_background` or manual channel matte), use as a true frame overlay; or
- (b) Treat the panel as intentionally opaque — the detail panel hides what's behind it anyway — and color-match by putting the image inside a `#0d0a06` panel with `mix-blend-mode: lighten` so only the gold ornament reads.
Recommendation: (b) first — zero asset surgery, and an opaque reading panel is arguably better UX; fall back to (a) if the design wants the graph ghosting through.

*Minor, accepted as-is:* frame corner ornaments are near-identical rather than perfectly identical (top pair vs bottom pair differ in small details) — reads as hand-crafted, not broken; Essay 4's shelving reads warm brown rather than green-tinted — within palette tolerance.

---

## 5. Total asset payload

| | Size |
|---|---|
| **Total masters on disk (PNG)** | **58.5 MB** |
| — of which hero alone | 34.9 MB (60%) |
| Projected shipped payload after WebP/AVIF derivatives (see §6) | **~1.5–2.5 MB** for a full page-load of everything; ~500–800 KB for the landing page's critical path |

**The PNG masters must never ship to the browser.** They are the archive/source-of-truth. The build step generates compressed derivatives (WebP + AVIF, multiple widths). Expected per-asset shipped sizes: hero ~250–400 KB @1920w AVIF; backdrop ~150–250 KB; dividers ~15–40 KB each; openers ~80–150 KB each; frame ~30–60 KB.

---

## 6. Loading strategy per asset

| Asset | Element | Loading | Rationale |
|---|---|---|---|
| Hero | `<img>` (in `<picture>` with AVIF/WebP sources + srcset 960/1440/1920/2560w) | **Preload** (`fetchpriority="high"`, no `loading` attr) | It's the LCP element. `<img>` not CSS background so the preload scanner finds it and it gets proper priority. |
| Backdrop | CSS `background-image` on the graph section (or absolutely-positioned `<img loading="lazy">`) | **Lazy** unless the pattern web is above the fold on the landing page — then preload a low-res (960w) version and swap | Decorative, behind a canvas; must never compete with hero for bandwidth. |
| Dividers ×3 | CSS `background-image` on a divider component (decorative, no semantic content → not `<img>`) | **Lazy** (they're below the fold by definition); tiny after compression, cached once, reused everywhere | Pure ornament; CSS keeps them out of the accessibility tree. |
| Essay openers ×4 | `<img>` with explicit `width`/`height` (CLS protection), `alt` describing the scene | **Lazy** (`loading="lazy"`) on index pages; on an essay's own page the opener is the LCP → `fetchpriority="high"` there | Content images with meaning → semantic `<img>` with alt text. |
| Node frame | CSS `border-image` (9-slice, per brief) or panel background on the detail component | **Lazy / on-interaction** — fetch when the graph first renders, before first node click (idle-time prefetch) | Never needed at page load; must be instant by first click. |

Cross-cutting: all derivatives fingerprinted + `Cache-Control: immutable`; `<link rel="preload">` only for the hero; everything else discovers naturally.

---

## 7. CSS custom properties — color

```css
:root {
  /* ── Ground ─────────────────────────────── */
  --color-bg:            #0d0a06;  /* deep warm dark — page base */
  --color-bg-raised:     #161009;  /* panels one step up from base */
  --color-bg-overlay:    rgba(13, 10, 6, 0.85);  /* scrims, modals */

  /* ── Identity ───────────────────────────── */
  --color-gold:          #c9a84c;  /* ornament, rules, accents, links */
  --color-gold-bright:   #e0c968;  /* hover/active gold */
  --color-green:         #2d6a4f;  /* deep green — architectural secondary */
  --color-cream:         #f0e6cc;  /* filtered light, emphasis surfaces */

  /* ── Text ───────────────────────────────── */
  --color-text:          #f5f0e8;  /* warm white — body text */
  --color-text-muted:    rgba(245, 240, 232, 0.64);  /* captions, metadata */
  --color-text-faint:    rgba(245, 240, 232, 0.40);  /* hairlines-of-text */

  /* ── Semantic (data layer ONLY — never decorative) ── */
  --color-statute:       #b5451b;  /* red — statutes */
  --color-treaty:        #1d4e89;  /* blue — treaties */
  --color-caselaw:       #5c3d8f;  /* purple — case law */

  /* Readable-on-dark variants for node labels / legend text.
     The base semantic colors sit at ~3:1 on #0d0a06 — fine for
     32px+ node fills, too low for small text. */
  --color-statute-text:  #e06a3a;
  --color-treaty-text:   #4f83c4;
  --color-caselaw-text:  #9a76d4;

  /* ── Lines & borders ───────────────────── */
  --color-rule:          rgba(201, 168, 76, 0.35);  /* hairline gold rules */
  --color-rule-strong:   var(--color-gold);
}
```

> Note: The `-text` semantic variants are derived (lightened ~25%) to pass WCAG AA (4.5:1) against `--color-bg` for small text; the raw brand values stay for fills, edges, and large shapes.

---

## 8. Font stack recommendation

All Google Fonts, three families, loaded with `font-display: swap`, subset to `latin`:

```css
:root {
  /* Display — engraved-inscription feel: chapter titles, section headings,
     the project wordmark. Cinzel is built from Roman square capitals —
     the letterform language of institutional stone inscription. */
  --font-display: "Cinzel", "Trajan Pro", Georgia, serif;

  /* Body — scholarly longform: essays, node descriptions.
     EB Garamond is the archive/university-press register, excellent
     at long measure, and holds up at 18px+ on dark backgrounds. */
  --font-body: "EB Garamond", Garamond, "Iowan Old Style", Georgia, serif;

  /* UI — geometric deco sans: nav, labels, buttons, graph legend,
     metadata chips. Josefin Sans is explicitly 1920s-geometric —
     the deco counterpoint to the two serifs. Used in small caps /
     letter-spaced uppercase for that engraved-plate look. */
  --font-ui: "Josefin Sans", "Futura", "Century Gothic", ui-sans-serif, sans-serif;
}
```

Usage rules:
- **Cinzel**: uppercase only (it has no true lowercase design intent), letter-spaced `0.06em+`, never below 20px, weights 400/600.
- **EB Garamond**: 400/500/italic, body at 1.125rem–1.25rem, line-height 1.65, max measure 68ch.
- **Josefin Sans**: 300/400/600, uppercase with `letter-spacing: 0.12em` for labels; sentence case for buttons.
- Load: 2 weights per family max on first paint (5 files, ~150 KB woff2 total); preload the two above-the-fold faces (Cinzel 600, EB Garamond 400).

---

## 9. Base CSS variables — spacing, grid, breakpoints

```css
:root {
  /* ── Spacing — 8px base, ratio-stepped ─── */
  --space-2xs: 0.25rem;   /*  4px */
  --space-xs:  0.5rem;    /*  8px */
  --space-sm:  0.75rem;   /* 12px */
  --space-md:  1rem;      /* 16px */
  --space-lg:  1.5rem;    /* 24px */
  --space-xl:  2.5rem;    /* 40px */
  --space-2xl: 4rem;      /* 64px */
  --space-3xl: 6.5rem;    /* 104px — section breathing room */
  --space-4xl: 10rem;     /* 160px — the "expansive" register: hero, chapter breaks */

  /* ── Type scale — Perfect Fourth (1.333), archive-formal ── */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1.125rem;   /* body: 18px — longform on dark needs the size */
  --text-lg:   1.5rem;
  --text-xl:   2rem;
  --text-2xl:  2.667rem;
  --text-3xl:  3.556rem;
  --text-4xl:  4.741rem;   /* hero title */
  --leading-tight: 1.15;   /* display */
  --leading-body:  1.65;   /* essays */

  /* ── Layout ─────────────────────────────── */
  --container-max:   84rem;    /* 1344px — full-bleed sections' inner limit */
  --container-prose: 42rem;    /* 672px  — essay measure (~68ch at 18px Garamond) */
  --container-wide:  64rem;    /* 1024px — graph, tables, figures */
  --grid-columns: 12;
  --grid-gutter: var(--space-lg);

  /* ── Radii & borders — deco is rectilinear; keep radii near zero ── */
  --radius-sm: 2px;
  --radius-md: 4px;        /* max — anything rounder breaks the deco language */
  --border-hairline: 1px solid var(--color-rule);

  /* ── Z-scale ────────────────────────────── */
  --z-backdrop: 0;   /* oculus image */
  --z-graph:    10;  /* force-directed canvas */
  --z-panel:    20;  /* node detail panel */
  --z-nav:      30;
  --z-modal:    40;
}

/* ── Breakpoints (used in media queries; custom properties
      can't be used in @media, so these are documented tokens) ──
   --bp-sm:  640px   — large phones landscape
   --bp-md:  768px   — tablets; graph switches to touch layout
   --bp-lg:  1024px  — desktop; side-by-side panel + graph
   --bp-xl:  1280px  — full grandeur layout
   --bp-2xl: 1536px  — cap; beyond this the container stops growing */
```

Mobile-first; the two content widths (`--container-prose` for essays, `--container-wide` for the graph) hang inside `--container-max` on the 12-column grid.

---

## Pre-build checklist (actions the build's first task will execute)

1. Generate AVIF/WebP derivatives at 4 widths per photographic asset (sharp or squoosh-cli), keeping PNGs as masters out of the web root.
2. Apply the hero scrim + backdrop vignette as CSS layers (no asset edits).
3. Decide frame approach (§4.5 b-then-a).
4. Subset + self-host the three Google Font families.

---

*Audit complete. Awaiting review before the website build begins.*
