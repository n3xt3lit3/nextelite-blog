#!/usr/bin/env python3
"""verify-build.py — beviser URL- og innholds-bevaring etter build.py.

Kjør: python3 tools/verify-build.py   (ren Python 3 stdlib)

Sjekker (Krav 7 / dvl:// catch):
  (a) alle dagens .html-stier finnes (flate poster + passthrough-seksjoner)
  (b) tekst-innhold per post bevart — normalisert diff mot de originale
      JS-innholdsarrayene (git show main:...) OG mot content/posts/*.md
  (c) canonical / og:url / JSON-LD korrekt per side
      (selv-canonical, BlogPosting på alle poster)
  (d) sitemap.xml komplett inkl. boxing/legal-seksjoner
  (e) feed.xml er well-formed XML med riktig antall items

Exit 0 = alle PASS. Exit 1 = minst én FAIL.
"""

import html as htmllib
import json
import os
import re
import subprocess
import sys

# Enkelte homebrew-Python-bygg har ødelagt pyexpat (dylib-mismatch).
# XML-sjekkene (d)+(e) krever expat — fall tilbake til system-Python.
try:
    import xml.parsers.expat  # noqa: F401
except ImportError:
    if os.environ.get("VERIFY_REEXEC") != "1" and os.path.exists("/usr/bin/python3"):
        os.environ["VERIFY_REEXEC"] = "1"
        os.execv("/usr/bin/python3", ["/usr/bin/python3"] + sys.argv)
    sys.exit("pyexpat mangler og ingen fallback-Python funnet")

import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://nextelite.no"

failures = []
passes = 0


def check(ok, label, detail=""):
    global passes
    if ok:
        passes += 1
        print(f"  PASS  {label}")
    else:
        failures.append(label)
        print(f"  FAIL  {label}" + (f" — {detail}" if detail else ""))


def read(relpath):
    with open(os.path.join(ROOT, relpath), encoding="utf-8") as f:
        return f.read()


# draft: true frontmatter — speiler build.py-gaten (d981427):
# `str(p.get("draft", "")).strip().lower() in ("true", "yes", "1")`.
# Frontmatter er alltid i toppen, så les kun de første 2 KB.
_DRAFT_RE = re.compile(r"^draft:\s*(true|yes|1)\s*$",
                       re.MULTILINE | re.IGNORECASE)


def _is_draft(path):
    with open(path, encoding="utf-8") as fh:
        return bool(_DRAFT_RE.search(fh.read(2000)))


# ── normalisering ──────────────────────────────

def js_unescape(s):
    """JS-string-literal → tekst. Målrettet: \\uXXXX, \\', \\", \\\\, \\/."""
    s = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return (s.replace("\\'", "'").replace('\\"', '"')
            .replace("\\/", "/").replace("\\\\", "\\"))


def strip_tags(s):
    """Fjern KUN ekte HTML-tagger — '<333' overlever."""
    return re.sub(r"</?[a-zA-Z][^>]*>", "", s)


def norm(s):
    """Normalisert tekst for innholds-diff: uten tagger/entiteter, kollapset."""
    s = strip_tags(s)
    s = htmllib.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def extract_js_strings(src):
    """Alle no:/en:/alt_no:/alt_en:/caption_*-tekstverdier fra et JS-array-slice.

    index.html bruker enkle anførselstegn, forste-kamp.html doble — begge
    fanges. Nestede {no: ..., en: ...} i alt/caption-dicts fanges av samme
    mønster.
    """
    out = []
    pattern = (r'\b(?:no|en|alt_no|alt_en|caption_no|caption_en)\s*:\s*'
               r'("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')')
    for m in re.finditer(pattern, src):
        out.append(js_unescape(m.group(1)[1:-1]))
    return [s for s in out if s.strip()]


def slice_array(src, marker):
    start = src.find(marker)
    if start < 0:
        return None
    open_idx = src.find("[", start)
    end_idx = src.find("\n];", open_idx)
    if end_idx < 0:
        return None
    return src[open_idx:end_idx + 2]


def git_show(ref_path):
    r = subprocess.run(["git", "show", ref_path], cwd=ROOT,
                       capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


# ── (a) URL-stier ──────────────────────────────

print("(a) Dagens URL-stier finnes som filer")
for relpath in [
    "index.html", "forste-kamp.html", "pakken-kom.html", "fotball.html",
    "boxing/index.html", "medlemskap/index.html", "personvern/index.html",
    "personvern/historikk/index.html", "salgsbetingelser/index.html",
    "CNAME", "robots.txt", "sitemap.xml", "feed.xml",
    "lang.js", "lang-toggle.css",
    "arkiv/index.html", "arkiv/2026.html",
]:
    check(os.path.exists(os.path.join(ROOT, relpath)), f"finnes: /{relpath}")
for d in ["img", "fonts", "share-cards"]:
    check(os.path.isdir(os.path.join(ROOT, d)), f"katalog: /{d}/")

# ── (b) innholds-bevaring ──────────────────────

print("(b) Tekst-innhold per post bevart (normalisert diff)")

PAGES = {
    "forste-kamp": read("forste-kamp.html"),
    "fotball": read("fotball.html"),
    "pakken-kom": read("pakken-kom.html"),
    "index": read("index.html"),
}
NORM_PAGES = {k: norm(v) for k, v in PAGES.items()}
RAW_COLLAPSED = {k: re.sub(r"\s+", " ", htmllib.unescape(v)) for k, v in PAGES.items()}


def content_preserved(strings, page_key, label):
    # anti-vacuous-guard (§4.1.7): 0 ekstraherte strenger er en FAIL i
    # ekstraksjonen, aldri et bevis på bevaring.
    if len(strings) < 10:
        check(False, f"{label}: ekstraksjon ga kun {len(strings)} strenger",
              "kildemønsteret matcher ikke — sjekk regex/quote-stil")
        return
    page_text = NORM_PAGES[page_key]
    page_raw = RAW_COLLAPSED[page_key]
    missing = []
    for s in strings:
        n = norm(s)
        if n and n not in page_text and n not in page_raw:
            missing.append(n[:80])
    check(not missing, f"{label}: {len(strings)} strenger bevart i {page_key}.html",
          f"mangler {len(missing)}: {missing[:3]}")


# (b1) mot de originale JS-arrayene på main (migrasjonsbeviset)
old_index = git_show("main:index.html")
old_vega = git_show("main:forste-kamp.html")
legacy = old_index and "postFotballContent" in old_index
if legacy:
    fotball_src = slice_array(old_index, "const postFotballContent =")
    pakken_src = slice_array(old_index, "let blogContent =")
    vega_src = slice_array(old_vega, "const postForsteKampContent =")
    content_preserved(extract_js_strings(fotball_src), "fotball", "main:index.html→fotball")
    content_preserved(extract_js_strings(pakken_src), "pakken-kom", "main:index.html→pakken-kom")
    content_preserved(extract_js_strings(pakken_src), "index", "main:index.html→forside")
    content_preserved(extract_js_strings(vega_src), "forste-kamp", "main:forste-kamp.html")
else:
    print("  SKIP  legacy-arrays ikke på main (post-migrasjon) — bruker kun content/-sjekk")

# (b2) mot content/posts/*.md (varig kontrakt, kjører også i CI)
POSTS_DIR = os.path.join(ROOT, "content", "posts")
for fname in sorted(os.listdir(POSTS_DIR)):
    if not fname.endswith(".md"):
        continue
    if _is_draft(os.path.join(POSTS_DIR, fname)):
        continue
    body = open(os.path.join(POSTS_DIR, fname), encoding="utf-8").read()
    slug = re.search(r"^slug: (.+)$", body, re.M).group(1)
    strings = [m.group(2) for m in re.finditer(
        r"^(no|en|alt_no|alt_en|caption_no|caption_en|title_no|title_en|kicker_no|kicker_en): (.+)$",
        body, re.M)]
    content_preserved(strings, slug, f"content/{fname}")

# (b3) strukturell blokk-bevaring (HIGH-001): substring-sjekken i (b1)/(b2)
# beviser at teksten ikke er BORTE, men ikke at den rendres i riktig
# blokk-struktur. Disse asserts teller renderte blokker mot kildefila.
print("(b3) strukturell blokk-bevaring (block-count per post)")
for fname in sorted(os.listdir(POSTS_DIR)):
    if not fname.endswith(".md"):
        continue
    if _is_draft(os.path.join(POSTS_DIR, fname)):
        continue
    body = open(os.path.join(POSTS_DIR, fname), encoding="utf-8").read()
    slug = re.search(r"^slug: (.+)$", body, re.M).group(1)
    page = read(f"{slug}.html")
    types = re.findall(r"^::(\S+)", body, re.M)
    n_para = types.count("paragraph")
    n_fig = types.count("image") + types.count("video") + types.count("image-pair")
    if re.search(r"^variant: vega$", body, re.M):
        n_fig += 1  # vega: header_image fra frontmatter rendres som egen <figure>
    n_disc = types.count("disclosure")
    got_p = len(re.findall(r"<p[ >]", page))
    got_fig = page.count("<figure")
    got_disc = page.count('<aside class="affiliate-disclosure')
    check(got_p >= n_para,
          f"{slug}: {got_p} <p> >= {n_para} ::paragraph-blokker")
    check(got_fig == n_fig,
          f"{slug}: {got_fig} <figure> == {n_fig} bilde/video-blokker i kilden")
    check(got_disc == n_disc,
          f"{slug}: {got_disc} disclosure-blockquotes == {n_disc} ::disclosure-blokker")

# ── (c) canonical / og:url / JSON-LD ───────────

print("(c) canonical / og:url / JSON-LD per side")


def head_meta(page, pattern):
    m = re.search(pattern, page)
    return m.group(1) if m else None


for slug in ["forste-kamp", "pakken-kom", "fotball"]:
    page = PAGES[slug]
    canonical = head_meta(page, r'<link rel="canonical" href="([^"]+)"')
    og_url = head_meta(page, r'<meta property="og:url" content="([^"]+)"')
    expected = f"{SITE}/{slug}"
    check(canonical == expected, f"{slug}: selv-canonical", f"{canonical!r} != {expected!r}")
    check(og_url == expected, f"{slug}: og:url uten hash == canonical", f"{og_url!r}")
    types = [json.loads(m.group(1)).get("@type") for m in re.finditer(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>', page, re.S)]
    check("BlogPosting" in types, f"{slug}: JSON-LD BlogPosting", f"fant {types}")
    check("BreadcrumbList" in types, f"{slug}: JSON-LD BreadcrumbList", f"fant {types}")

idx = PAGES["index"]
check(head_meta(idx, r'<link rel="canonical" href="([^"]+)"') == f"{SITE}/",
      "forside: canonical https://nextelite.no/")
idx_types = [json.loads(m.group(1)).get("@type") for m in re.finditer(
    r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>', idx, re.S)]
check("Blog" in idx_types, "forside: JSON-LD Blog", f"fant {idx_types}")
check("location.replace" in idx and "fotball" in idx.split("location.replace")[0][-2000:] or
      re.search(r'var slugs = \{[^}]*"fotball"', idx) is not None,
      "forside: hash-redirect-snutt med fotball-slug")

# ── (d) sitemap ────────────────────────────────

print("(d) sitemap.xml komplett")
sm = ET.parse(os.path.join(ROOT, "sitemap.xml"))
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
locs = {el.text for el in sm.getroot().findall(".//s:url/s:loc", ns)}
for required in [
    f"{SITE}/", f"{SITE}/forste-kamp", f"{SITE}/pakken-kom", f"{SITE}/fotball",
    f"{SITE}/arkiv/", f"{SITE}/arkiv/2026",
    f"{SITE}/boxing/", f"{SITE}/medlemskap/", f"{SITE}/personvern/",
    f"{SITE}/personvern/historikk/", f"{SITE}/salgsbetingelser/",
]:
    check(required in locs, f"sitemap: {required}")

# ── (e) feed ───────────────────────────────────

print("(e) feed.xml well-formed")
try:
    feed = ET.parse(os.path.join(ROOT, "feed.xml"))
    items = feed.getroot().findall(".//item")
    n_posts = sum(1 for f in os.listdir(POSTS_DIR)
                  if f.endswith(".md")
                  and not _is_draft(os.path.join(POSTS_DIR, f)))
    check(len(items) == n_posts,
          f"feed: {len(items)} items == {n_posts} publiserbare poster")
    links = [i.find("link").text for i in items]
    check(f"{SITE}/pakken-kom" in links, "feed: nyeste post i feed")
except ET.ParseError as e:
    check(False, "feed.xml parser", str(e))

# ── resultat ───────────────────────────────────

print()
if failures:
    print(f"RESULTAT: {len(failures)} FAIL, {passes} PASS")
    for f in failures:
        print(f"  FAIL: {f}")
    sys.exit(1)
print(f"RESULTAT: ALLE {passes} SJEKKER PASS")
