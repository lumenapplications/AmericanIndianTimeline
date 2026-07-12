#!/usr/bin/env python3
"""Assemble index.html from build parts. Content blocks are verbatim from
record-timeline.html — this script only stitches, never rewrites them."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
B = ROOT / "build"

shell = (B/"part-shell.html").read_text(encoding="utf-8")
css   = (B/"part-css.css").read_text(encoding="utf-8")
home  = (B/"home-essay.html").read_text(encoding="utf-8")
patt  = (B/"pattern-sections.html").read_text(encoding="utf-8")
gloss = (B/"glossary.html").read_text(encoding="utf-8")
thesis= (B/"thesis.html").read_text(encoding="utf-8")
core  = (B/"data-core.js").read_text(encoding="utf-8")
maps  = (B/"data-maps.js").read_text(encoding="utf-8")
app   = (B/"part-app.js").read_text(encoding="utf-8")
web   = (B/"part-web.js").read_text(encoding="utf-8")

# thesis: pull just the <p> inner text
m = re.search(r'<p class="rp-thesis-text">(.*?)</p>', thesis, re.S)
thesis_inner = m.group(1).strip() if m else thesis

# home footer (verbatim legal block) appended after essay
footer = '''<footer class="pt-footer">
  <p class="pt-footer-copy">&copy; 2025 Maxwell Edridge. All rights reserved. Research compilation &mdash; historical and legal information only. Not legal advice.</p>
  <p class="pt-footer-license">This work is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a>. You may share this research with attribution to Maxwell Edridge. Commercial use and derivative works are prohibited without written permission.</p>
</footer>'''

# glossary: give the search input an id + input handler hook (markup-level adjust, not content)
gloss = gloss.replace('class="gloss-search"', 'class="gloss-search" id="glossSearch"', 1)

out = shell
out = out.replace("/*@CSS@*/", css)
out = out.replace("<!--@HOME_ESSAY@-->", home + "\n" + footer)
out = out.replace("<!--@PATTERN_SECTIONS@-->", patt)
out = out.replace("<!--@GLOSSARY@-->", gloss)
out = out.replace("<!--@THESIS@-->", thesis_inner)  # occurs twice (timeline + research)
out = out.replace("/*@DATA_CORE@*/", core)
out = out.replace("/*@DATA_MAPS@*/", maps)
out = out.replace("/*@APP_JS@*/", app)
out = out.replace("/*@WEB_JS@*/", web)

# sanity checks
errs = []
for marker in ["@CSS@","@HOME_ESSAY@","@PATTERN_SECTIONS@","@GLOSSARY@","@THESIS@","@DATA_CORE@","@DATA_MAPS@","@APP_JS@","@WEB_JS@"]:
    if marker in out: errs.append(f"unreplaced marker {marker}")
for needle, want in [("var D=[",1), ("var CONNECTIONS",1), ("var ESSAYS",1), ("var RD",1), ("var MAPS",1),
                     ("gloss-term", 21+2)]:  # 21 entries + css/class refs tolerance
    if out.count(needle) < 1: errs.append(f"missing {needle}")
if errs:
    print("ASSEMBLY ERRORS:", errs); sys.exit(1)

dest = ROOT / "index.html"
dest.write_text(out, encoding="utf-8")
print(f"OK wrote {dest} ({len(out):,} bytes)")
print("gloss-term count:", out.count("gloss-term"))
