# The Pattern — Visual Asset Brief

**Project:** The Pattern — a public education research project by Maxwell Edridge
**Aesthetic direction:** Library of Congress meets sacred geometry. Art deco architectural grandeur. Expansive. Beautiful. The feeling of being inside one of the great research archives of the world — where what you are reading carries the weight of what it actually is.
**Generation tool:** Higgsfield (image)
**Status:** DRAFT FOR APPROVAL — no images to be generated until this brief is signed off.

---

## Master palette (applies to every asset)

| Token | Hex | Role |
|---|---|---|
| Background | `#0d0a06` | Deep warm dark — the base of nearly every asset |
| Gold | `#c9a84c` | Ornament, geometry, light, primary accent |
| Deep green | `#2d6a4f` | Marble, architectural mass, secondary accent |
| Cream | `#f0e6cc` | Filtered light, paper, warm highlights |
| Red (statute) | `#b5451b` | Reserved semantic accent — use sparingly |
| Blue (treaty) | `#1d4e89` | Reserved semantic accent — use sparingly |
| Purple (case law) | `#5c3d8f` | Reserved semantic accent — use sparingly |
| White text | `#f5f0e8` | Warm white, near-cream |

**Global rules for every prompt:**
- No people. No human figures. No text or lettering rendered inside the image.
- Warm dark base — never neutral gray, never cool black. Everything sits on `#0d0a06`.
- Gold is light, not just paint: it should read as illuminated ornament.
- Sacred geometry is precise and architectural, not new-age or glowy-mystical.
- Deliver as high-resolution PNG. Where an asset overlays other content, deliver on transparent or seamless dark ground as specified.
- The three semantic accents (red/blue/purple) are for the UI/data layer — keep them OUT of the architectural imagery unless a spec calls for them.
- **Photorealism rule (added in review, 2026-07-11):** All photographic/scene assets (hero, backdrop, four essay openers) must read as real photographs — documentary architectural photography, camera/lens language, available light, natural imperfections (grain, vignetting, realistic dynamic range). Avoid "painterly," "cinematic," "museum-grade," and "relit in a palette" phrasing — these push toward a CG/matte-painting look. Pure line-work assets (dividers, node frame) remain graphic as briefed.

---

## 1. HERO IMAGE

**1. Asset name / filename:** Hero — The Reading Room · `hero-reading-room.png`

**2. Purpose:** Full-width hero at the top of the landing page. First impression of the entire project. Sets the "you are inside the great archive" tone. Text (title, tagline, entry CTA) will be overlaid, so the composition must hold quiet, low-contrast zones for legible type — the dome and upper architecture carry detail, the lower-center stays calmer.

**3. Higgsfield prompt (rev. 2 — photorealism direction, approved 2026-07-11):**
> A real photograph taken standing inside the main reading room of a monumental national library — the great domed rotunda hall with coffered ceiling, tiered balconies, arched clerestory windows, and concentric rings of ornate wooden reading desks. Shot on a full-frame camera with a 24mm wide-angle lens from eye level, looking across the hall and up into the dome. Documentary architectural photography, available light only: warm cream daylight (#f0e6cc) filtering down from the dome oculus, dust motes visible in the light shafts, warm gold gilded ornament and railings (#c9a84c) catching the light, deep green marble columns and floor (#2d6a4f), shadows falling into deep warm darkness (#0d0a06). Empty of people; open books and ledgers rest on the desks. Natural photographic imperfections — subtle grain, slight lens vignetting, realistic dynamic range with soft blown highlights at the oculus, mild perspective distortion at the frame edges. Looks like a photo a researcher took standing in the hall, not a render. No text, no signage, no people.

**4. Dimensions / format:** 2560 × 1440 (16:9), PNG. Generate at max resolution; upscale to ≥2560 wide. Design safe-area: keep the lower-center third calm for overlaid title text.

**5. Color / compositional requirements:** Green marble mass low and at columns; gold ornament in the mid/upper architecture; cream light source at the dome oculus. Symmetrical, single vanishing point up into the dome. No cool tones. Contrast concentrated in the upper half so overlaid text reads against the calmer lower half.

---

## 2. PATTERN WEB BACKDROP

**1. Asset name / filename:** Pattern Web Backdrop — The Oculus · `backdrop-oculus-dome.png`

**2. Purpose:** Background layer behind the interactive force-directed node graph ("the pattern web"). Must recede so that bright graph nodes and edges read clearly on top. Deep, dark, centered — the geometry should draw the eye inward toward the center where the graph will live.

**3. Higgsfield prompt:**
> A vast domed rotunda ceiling seen from directly below, looking straight up — perfect radial symmetry. Concentric rings of coffered art deco architecture and sacred geometry recede toward a single luminous central oculus of soft cream-gold light (#f0e6cc / #c9a84c). Fine golden geometric line-work — nested polygons, radial spokes, interlocking circles — traced in thin illuminated gold (#c9a84c) over a deep warm near-black ground (#0d0a06). The rings grow darker and more dense toward the outer edge, fading into blackness at the corners, so the composition is deep and receding with a bright focused center. Restrained, elegant, precise, architectural — not glowing or mystical. Subtle deep-green shadow tones (#2d6a4f) in the recesses. No people, no text.

**4. Dimensions / format:** 2048 × 2048 (1:1), PNG. Square so it can be centered/cropped responsively behind the graph canvas.

**5. Color / compositional requirements:** Perfectly radial and centered. Bright cream-gold center, near-black edges and corners (critical — nodes must pop against dark margins). Low overall contrast in the mid-ring band so graph edges remain legible. Gold geometry must be thin lines, not filled masses.

---

## 3. ORNAMENTAL DIVIDERS (3 variations)

**1. Asset name / filename:** Section Dividers ·
`divider-01-golden-spiral.png` ·
`divider-02-hex-lattice.png` ·
`divider-03-star-polygon.png`

**2. Purpose:** Horizontal rules that separate major page sections and essay breaks. Each of the three is visually distinct so a returning reader can subconsciously tell sections apart. Placed centered, with generous whitespace above and below. Must sit cleanly on the dark page background.

**3. Higgsfield prompts:**

*Generation note (added in production, 2026-07-11):* Higgsfield's widest ratio is 21:9 — generate at 21:9 with the ornament confined to a thin centered band ("the entire ornament fits inside a band one-sixth the height of the frame, nothing touches the top or bottom edges"), then center-crop to 2400×400 in post. Without the containment language the model draws a medallion taller than the band and the crop clips it.

*Divider 01 — Golden ratio spiral (rev. 2):*
> A wide, thin, horizontal art deco ornamental divider. A central medallion built from golden-ratio logarithmic spirals and nested Fibonacci arcs — the medallion is strongly horizontally elongated, an oval lozenge shape no taller than the flanking linework — flanked by symmetrical tapering art deco linework extending left and right to fine points at the frame edges. The entire ornament fits inside a thin horizontal band one-sixth the height of the frame, centered vertically; nothing touches the top or bottom edges, with large expanses of empty dark space above and below the band. Rendered in luminous gold (#c9a84c) line-work on a deep warm near-black ground (#0d0a06). Precise, geometric, elegant, symmetrical, engraved-medal quality. No text, no people, no color other than gold.

*Divider 02 — Hexagonal lattice:*
> A wide, thin, horizontal art deco ornamental divider. A central band of interlocking hexagonal lattice — a honeycomb sacred-geometry tessellation — dissolving symmetrically into tapering art deco lines that extend to fine points at left and right. Luminous gold (#c9a84c) line-work on a transparent / deep warm near-black ground (#0d0a06). Crisp, architectural, symmetrical, engraved quality. No text, no people, gold only.

*Divider 03 — Star polygon (rev. 2 — first take's star medallion exceeded the crop band and clipped):*
> A wide, thin, horizontal art deco ornamental divider. A central compound star polygon — interlocking heptagram / nonagram, unicursal geometric star — inside a fine circle, flanked by symmetrical tapering art deco linework running to fine points at the frame edges left and right. The central star medallion is small and compact — clearly shorter than it is wide as a composition, subordinate to the horizontal linework, the same height as the flanking chevrons. The entire ornament sits inside a thin horizontal band no more than one-sixth the height of the frame, centered vertically, with vast empty dark space above and below; the star and circle never touch the top or bottom of the band. Rendered in luminous gold (#c9a84c) line-work on a deep warm near-black ground (#0d0a06). Precise, radial, symmetrical, engraved-medal quality. No text, no people, no color other than gold.

**4. Dimensions / format:** 2400 × 400 (6:1), PNG **with transparent background** (deliver alpha; the dark-ground version is the fallback). All three at identical dimensions so they are drop-in interchangeable.

**5. Color / compositional requirements:** Gold only — no secondary colors. Horizontally symmetrical, center-weighted, tapering to fine points at both ends. Thin line-work, no heavy fills. The three must be clearly distinguishable at a glance (spiral vs. lattice vs. star). Consistent line weight and center-medallion height across all three so they feel like one set.

---

## 4. ESSAY CHAPTER OPENERS (4 images)

Shared spec for all four: banner/opener image at the head of each essay, behind or above the essay title. Portrait-friendly-to-landscape banner. Same palette, same "engraved architectural" register, so the four read as a series. No text baked in.

---

### 4a. Essay One — The Pen and the Institution

**1. Asset name / filename:** Opener 1 — The Pen · `essay-01-pen-institution.png`

**2. Purpose:** Chapter opener for Essay One. Theme: the individual act of writing set within institutional authority — the pen at the center of the order.

**3. Higgsfield prompt (rev. 2 — photorealism direction; geometry grounded as marble inlay):**
> A real photograph, shot from directly overhead, of an ornate gilded quill pen resting diagonally across an open leather-bound ledger on a dark green marble table (#2d6a4f). Inlaid into the marble around the ledger, radiating outward from the pen nib as the exact center, is a mandala of gold metal geometry (#c9a84c) — concentric rings, radial spokes, nested polygons — set flush into the stone like cathedral floor inlay. Available light only: a single warm light source above catches the gold inlay and the cream ledger pages (#f0e6cc), the edges of the frame falling into deep warm shadow (#0d0a06). Formal, heavy, ceremonial still life. Shot on a full-frame camera, 50mm lens, natural grain, slight vignetting, realistic reflections on the marble and gilding. The ledger pages are blank. Looks like a photograph of a real object on a real table, not a render. No people, no text.

*Generation note: Higgsfield has no 16:10 — generate at 3:2 and center-crop height to 1600×1000 in post (applies to all four openers).*

**4. Dimensions / format:** 1600 × 1000 (16:10), PNG.

**5. Color / compositional requirements:** Gold + deep green dominant, cream as the paper highlight. Pen nib is the exact center of a symmetrical mandala. Formal and heavy — dense geometry, low airiness.

---

### 4b. Essay Two — The Way of Scale

**1. Asset name / filename:** Opener 2 — The Way of Scale · `essay-02-way-of-scale.png`

**2. Purpose:** Chapter opener for Essay Two. Theme: deep time and recursive scale rendered as architecture.

**3. Higgsfield prompt (rev. 2 — photorealism direction; fractal tree grounded as branching vault architecture):**
> A real photograph taken looking straight up from the floor of a vast dark hall, wide-angle lens: massive columns rise and branch recursively like trees, their ribs splitting again and again into a fan-vaulted geometric canopy that fills the entire ceiling — architecture built like a fractal tree, deep time rendered in stone and metal. The branching ribs are edged in gold gilding (#c9a84c) that catches the available light like veins of fire against the deep warm near-black ceiling (#0d0a06); faint deep-green (#2d6a4f) tones in the shadowed stone; small gaps in the canopy glow with soft cream light (#f0e6cc) from above. The branch pattern visibly repeats at multiple scales, smaller and finer toward the apex. Documentary architectural photography, available light only, natural grain, slight vignetting, realistic dynamic range. A real ceiling in a real building, not a render. No people, no text.

**4. Dimensions / format:** 1600 × 1000 (16:10), PNG.

**5. Color / compositional requirements:** Gold veining on dark is the hero. Upward "worm's-eye" view. Cream light only as faint filtering through gaps. Emphasis on recursive self-similarity — the branch pattern should visibly repeat at multiple scales.

---

### 4c. Essay Three — The Binary Was Not the Beginning

**1. Asset name / filename:** Opener 3 — Before the Binary · `essay-03-binary-beginning.png`

**2. Purpose:** Chapter opener for Essay Three. Theme: two equal elements and the generative space between them — not opposition, but the undivided field that preceded the binary.

**3. Higgsfield prompt (rev. 2 — photorealism direction; geometry grounded as a gilded rood screen):**
> A real photograph of two identical classical columns of exactly equal height, pale cream limestone (#f0e6cc), facing each other across a shallow open space in a grand hall, perfectly symmetrical composition, camera centered between them at eye level. Spanning the space between the columns stands a delicate gilded metal screen (#c9a84c) — an open lattice of nested circles, a vesica piscis at its center, interlocking geometric tracery, like a cathedral rood screen — so the space between the columns reads as filled and whole, not empty. Soft diffuse daylight from above washes the cream stone; the hall behind falls away into deep warm shadow (#0d0a06). Brighter, calmer, and airier than a night shot — contemplative, balanced. Shot on a full-frame camera, 35mm lens, natural grain, gentle vignetting, realistic reflections on the gilded screen. A real place, not a render. No people, no text.

**4. Dimensions / format:** 1600 × 1000 (16:10), PNG.

**5. Color / compositional requirements:** Cream + gold dominant (this is the lightest, airiest of the four — intentional contrast to Essays One and Two). Perfect bilateral symmetry, two equal columns. The between-space carries the geometry; it must read as generative/whole, not as a gap or a fight.

---

### 4d. Essay Four — Next Steps

**1. Asset name / filename:** Opener 4 — The Threshold · `essay-04-next-steps.png`

**2. Purpose:** Chapter opener for Essay Four (closing essay). Theme: passage forward — the archive opens onto what comes next.

**3. Higgsfield prompt (rev. 2 — photorealism direction):**
> A real photograph taken inside a dark library corridor, one-point perspective centered on an open doorway in the far wall. The walls on both sides are lined floor-to-ceiling with shelved documents, archive boxes, and bound volumes, falling into deep warm shadow (#0d0a06) with faint deep-green (#2d6a4f) tones in the shelving. The door frame is ornate gilded art deco geometry (#c9a84c) — stepped mouldings, geometric corner ornament — catching light from beyond. Through the open door, warm golden light (#c9a84c into #f0e6cc) floods in — the brightest thing in the frame, softly blown out, spilling a long patch of light across the worn floor toward the camera. Available light only. Shot on a full-frame camera, 35mm lens, natural grain, slight vignetting, realistic dynamic range. Ceremonial and inviting — the threshold. A real place, not a render. No people, no text, no legible titles on the spines.

**4. Dimensions / format:** 1600 × 1000 (16:10), PNG.

**5. Color / compositional requirements:** Dark green shelved walls framing a bright cream-gold doorway at center. One-point perspective, doorway centered. The light beyond must be the brightest point in the whole essay-opener series — this is the "exit / forward" image.

---

## 5. NODE DETAIL PANEL FRAME

**1. Asset name / filename:** Node Detail Panel Frame · `frame-node-detail.png`

**2. Purpose:** Decorative frame that wraps the detail panel shown when a user clicks a node in the pattern web. Contains dynamic text/metadata about the selected node. The interior must stay clear and low-detail so overlaid UI text is fully legible; ornament lives at the border and corners.

**3. Higgsfield prompt:**
> An ornate rectangular art deco frame, landscape orientation, designed to border a panel of text. Gilded gold (#c9a84c) line-work border with elaborate sacred-geometry corner ornaments — nested polygons, radial fans, and fine geometric filigree at each of the four corners — connected by a slim, restrained art deco border along the edges. The interior is completely empty and dark (deep warm near-black #0d0a06), an unadorned flat panel ready for text. Symmetrical, precise, engraved-medal quality, gold on dark. Subtle deep-green (#2d6a4f) shadow behind the gold. No text, no people, no interior ornament.

**4. Dimensions / format:** 1200 × 800 (3:2, i.e. 600×400 @2x), PNG **with transparent interior** (deliver alpha so it can layer over live graph background; dark-interior version as fallback).

**5. Color / compositional requirements:** Gold border + corner ornaments only; interior must be empty/transparent for text. Border line-weight thin enough not to crowd a 600×400 panel. Four corners symmetrical and identical. Ornament concentrated at corners, minimal along the straight edges. Design as a 9-slice-friendly frame (stretchable straight edges, fixed corners) if the build calls for scaling.

---

## Delivery summary

| # | Asset | Filename | Dimensions | Alpha? |
|---|---|---|---|---|
| 1 | Hero — Reading Room | `hero-reading-room.png` | 2560×1440 | No |
| 2 | Backdrop — Oculus | `backdrop-oculus-dome.png` | 2048×2048 | No |
| 3a | Divider — Golden spiral | `divider-01-golden-spiral.png` | 2400×400 | Yes |
| 3b | Divider — Hex lattice | `divider-02-hex-lattice.png` | 2400×400 | Yes |
| 3c | Divider — Star polygon | `divider-03-star-polygon.png` | 2400×400 | Yes |
| 4a | Essay 1 — The Pen | `essay-01-pen-institution.png` | 1600×1000 | No |
| 4b | Essay 2 — Way of Scale | `essay-02-way-of-scale.png` | 1600×1000 | No |
| 4c | Essay 3 — Before the Binary | `essay-03-binary-beginning.png` | 1600×1000 | No |
| 4d | Essay 4 — The Threshold | `essay-04-next-steps.png` | 1600×1000 | No |
| 5 | Node Detail Frame | `frame-node-detail.png` | 1200×800 | Yes |

**Total: 10 images.**

---

*Awaiting approval. No images will be generated until this brief is signed off.*
