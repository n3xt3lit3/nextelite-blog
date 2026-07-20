#!/usr/bin/env python3
"""build.py — statisk generator for nextelite-blog.

Kjør: python3 build.py   (ren Python 3 stdlib, ingen pip-avhengigheter)

Leser content/posts/YYYY-MM-DD-slug.md (NO+EN i samme fil) og genererer:
  - <slug>.html        flate post-sider på eksakt dagens stier (URL-bevaring)
  - index.html         forsiden = nyeste post + post-nav (dagens semantikk)
  - arkiv/index.html   alle poster gruppert per år
  - arkiv/<år>.html    arkivside per år
  - sitemap.xml        alle poster + arkiv + boxing/legal-seksjoner
  - feed.xml           RSS 2.0

To markup-varianter, bevart 1:1 fra de to originale JS-rendererne:
  - "index"-varianten (renderBlog i gamle index.html): brukt av pakken-kom
    + fotball. Default. Blokk-tekst escapes som default (BLOCKER-001);
    blokker med `html: true` settes inn rått (legitim markup: lenker,
    strong — rå-med-vilje, eksplisitt per blokk).
  - "vega"-varianten (renderPost i forste-kamp.html): escapeHtml på all
    tekst, body-klasse v-vega for scopede CSS-avvik. Velges med
    `variant: vega` i frontmatter.

Begge språk emittes statisk som <span class="l-no">/<span class="l-en">
inni samme element; assets/blog.js + blog.css bytter synlighet.
"""

import datetime
import json
import os
import re
import sys
from email.utils import format_datetime
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, "content", "posts")
TEMPLATES_DIR = os.path.join(ROOT, "templates")

SITE = "https://nextelite.no"
SITE_NAME = "nextelite"
SITE_DESCRIPTION = "nextelite. boxing, protocol, art. en blogg fra vesteralen."
SITE_FOOTER_LABEL = "uke 1 / 2026"  # forsidens live footer-tekst i dag
PUBLISHER_LOGO = SITE + "/img/boxing-topten-mirror.jpg"

# Antall duplikater av marquee-item for sømløs translateX(-50%) loop.
# 6 tilsvarer ~2x desktop-viewport-bredde ved typisk item-lengde — nok
# horisontal luft for jevn animasjon uten hakk (enc0re REVIEW-260709 LOW).
MARQUEE_LOOP_COPIES = 6

# Statisk innhold utenfor bloggen — inn i sitemap (Krav 7d)
STATIC_SECTIONS = [
    "/boxing/",
    "/medlemskap/",
    "/personvern/",
    "/personvern/historikk/",
    "/salgsbetingelser/",
]


# ─────────────────────────────────────────────
# Parsing
# ─────────────────────────────────────────────

def parse_kv(line, path, lineno):
    m = re.match(r"^([a-z][a-z0-9_]*): ?(.*)$", line)
    if not m:
        sys.exit(f"{path}:{lineno}: forventet 'key: value', fikk: {line!r}")
    return m.group(1), m.group(2)


def parse_post(path):
    with open(path, encoding="utf-8") as f:
        lines = f.read().split("\n")
    if lines[0] != "---":
        sys.exit(f"{path}: mangler frontmatter '---'")
    meta = {}
    i = 1
    while lines[i] != "---":
        k, v = parse_kv(lines[i], path, i + 1)
        meta[k] = v
        i += 1
    i += 1

    blocks = []
    cur = None
    for lineno in range(i, len(lines)):
        line = lines[lineno]
        if line.startswith("::"):
            cur = {"type": line[2:].strip()}
            blocks.append(cur)
        elif line.strip() == "":
            cur = None
        else:
            if cur is None:
                sys.exit(f"{path}:{lineno + 1}: tekst utenfor blokk: {line!r}")
            k, v = parse_kv(line, path, lineno + 1)
            cur[k] = v

    required = ("slug", "date", "title_no", "title_en", "description")
    for k in required:
        if k not in meta:
            sys.exit(f"{path}: mangler frontmatter-felt {k!r}")
    # affiliate: true -> Forbrukertilsynet-merkingsplikt. Posten MAA ha
    # minst én ::disclosure-blokk. bl0g://-spec
    # (50-OUTBOX/bl0g-cowork-to-published-spec-260612-v01.md): build-feil
    # er den eneste forsvarbare gaten — et glemt disclosure-flagg er en
    # legal/compliance-risiko, ikke en stil-feil.
    if str(meta.get("affiliate", "")).strip().lower() in ("true", "yes", "1"):
        if not any(b["type"] == "disclosure" for b in blocks):
            sys.exit(
                f"{path}: 'affiliate: true' i frontmatter krever minst én "
                f"::disclosure-blokk i posten (Forbrukertilsynet-merkingsplikt)."
            )
    meta["_date"] = datetime.date.fromisoformat(meta["date"])
    meta["_blocks"] = blocks
    meta["_path"] = path
    return meta


# ─────────────────────────────────────────────
# Hjelpere
# ─────────────────────────────────────────────

def esc(s):
    """Identisk med escapeHtml() i forste-kamp.html."""
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;").replace("'", "&#39;"))


def attr(s):
    """Trygg attributt-verdi (samme tegnsett som esc)."""
    return esc(s)


def bi(no, en):
    """Begge språk i samme element. CSS skjuler det inaktive."""
    if no == en:
        return no
    return f'<span class="l-no">{no}</span><span class="l-en">{en}</span>'


def bi_esc(no, en):
    return bi(esc(no), esc(en))


def esc_text(s):
    """Tekst-node-escaping (&, <, >). Kvoter er ufarlige utenfor attributter
    — bevarer apostrofer byte-likt i eksisterende poster."""
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def bi_text(no, en):
    return bi(esc_text(no), esc_text(en))


def block_bi(b, no_key="no", en_key="en"):
    """Blokk-tekst i index-varianten. Escaped som default (BLOCKER-001).
    `html: true` på blokken = rå-med-vilje (legitim markup i innholdet)."""
    if b.get("html") == "true":
        return bi(b[no_key], b[en_key])
    return bi_text(b[no_key], b[en_key])


def bi_attr(name, no, en, default_lang="no"):
    """Attributt med JS-byttbar tospråklighet (alt / aria-label)."""
    base = no if default_lang == "no" else en
    if no == en:
        return f' {name}="{attr(base)}"'
    return (f' {name}="{attr(base)}" data-{name.replace("aria-label", "aria")}-no="{attr(no)}"'
            f' data-{name.replace("aria-label", "aria")}-en="{attr(en)}"')


def oslo_offset(d):
    """Europe/Oslo UTC-offset for en dato (siste søndag mars→oktober = CEST)."""
    def last_sunday(year, month):
        last = datetime.date(year, month, 31 if month in (3, 10) else 30)
        return last - datetime.timedelta(days=(last.weekday() + 1) % 7)
    if last_sunday(d.year, 3) <= d < last_sunday(d.year, 10):
        return "+02:00", datetime.timezone(datetime.timedelta(hours=2))
    return "+01:00", datetime.timezone(datetime.timedelta(hours=1))


def canonical_url(post):
    return f"{SITE}/{post['slug']}"


def read_template(name):
    with open(os.path.join(TEMPLATES_DIR, name), encoding="utf-8") as f:
        return f.read()


def write_out(relpath, content):
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path) or ROOT, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  wrote {relpath}")


# ─────────────────────────────────────────────
# Markup-varianter: nav
# ─────────────────────────────────────────────

def nav_html(variant, page, root=""):
    """Site-nav. variant: 'index' | 'vega'. page: 'home' | 'post' | 'arkiv'."""
    if variant == "vega":
        return f'''<nav>
  <div class="nav-left">
    <a href="{root}index.html" class="nav-link" data-no="blogg" data-en="blog">blogg</a>
    <a href="https://nextelite.no/boxing/" class="nav-link" target="_blank" rel="noopener">gloves on</a>
  </div>
  <a href="{root}index.html" class="nav-logo">nextelite</a>
  <div class="nav-right">
    <div class="lang-toggle desktop-lang">
      <button class="lang-btn active" data-lang-btn="no">NO</button>
      <span class="lang-sep">/</span>
      <button class="lang-btn" data-lang-btn="en">EN</button>
    </div>
  </div>
  <div class="lang-toggle mobile-lang">
    <button class="lang-btn active" data-lang-btn="no">NO</button>
    <span class="lang-sep">/</span>
    <button class="lang-btn" data-lang-btn="en">EN</button>
  </div>
</nav>'''
    # index-varianten. Forsiden: blogg → arkiv/ (var død '#'-lenke, pixel-likt).
    # Post-/arkivsider: blogg + logo → index.html.
    blogg_href = "arkiv/" if page == "home" else f"{root}index.html"
    logo_href = "#" if page == "home" else f"{root}index.html"
    return f'''<nav>
  <div class="nav-left">
    <a href="{blogg_href}" class="nav-link" data-no="blogg" data-en="blog">blogg</a>
    <a href="#" class="nav-link">protokoll</a>
  </div>
  <a href="{logo_href}" class="nav-logo">nextelite</a>
  <div class="nav-right">
    <a href="#" class="nav-link">om</a>
    <div class="lang-toggle desktop-lang">
      <button class="lang-btn active" data-lang-btn="no">NO</button>
      <span class="lang-sep">/</span>
      <button class="lang-btn" data-lang-btn="en">EN</button>
    </div>
  </div>
  <div class="lang-toggle mobile-lang">
    <button class="lang-btn active" data-lang-btn="no">NO</button>
    <span class="lang-sep">/</span>
    <button class="lang-btn" data-lang-btn="en">EN</button>
  </div>
</nav>'''


# ─────────────────────────────────────────────
# Markup-varianter: marquee (announcement bar, index only)
# ─────────────────────────────────────────────

def marquee_html(latest, root=""):
    """Announcement-bånd øverst på forsiden — «hei fra vesterålen <3 ny post · <lenke>».
    Selv-oppdaterende: tittel + slug kommer fra nyeste post (posts[0] etter dato-sort).
    Portert fra rhode-staging (l1ft0ff / Mission Cassini) og oversatt til publisert-
    designets språk (Inter, tokens, l-no/l-en bilingual). Sitewide fra
    2026-07-19 (CEO): forside, post- og arkiv-sider, alltid lenke til nyeste post.
    Sømløs loop: samme item duplisert 6 ganger så translateX(-50%) løper uten hakk.
    Prefers-reduced-motion: CSS + JS begge stopper animasjonen (rhode hadde bare
    duration-squish — dispatch krevde ekte static). Pause-knapp er 44x44 touch-target."""
    slug = latest["slug"]
    title_no = latest["title_no"]
    title_en = latest["title_en"]
    href = f"{root}{attr(slug)}.html"
    # `&lt;3` = the <3 glyph. Escaped tekst-node (esc_text-mekanikk) så
    # posten-tittel-endring aldri kan bryte ut av span-kontekst.
    ny_post = bi("ny post", "new post")
    hei = bi("hei fra vesterålen", "hi from vesterålen")
    heart = '<span class="marquee__heart" aria-hidden="true">&lt;3</span>'

    def build_item(is_copy):
        """Ett bånd-item. is_copy=True → aria-hidden + tabindex=-1 på lenken
        så duplikatene (2..N) ikke annonseres 6 ganger av skjermleser og
        heller ikke er tabbable (vrd1ct QA BUG-002 fix)."""
        hidden_attr = ' aria-hidden="true"' if is_copy else ''
        link_tab = ' tabindex="-1"' if is_copy else ''
        link_html = (f'<a href="{href}" class="marquee__link"{link_tab}>'
                     f'{bi_text(title_no, title_en)}</a>')
        return (f'<span class="marquee__item"{hidden_attr}>{hei}&nbsp;'
                f'{heart}&nbsp;{ny_post}&nbsp;·&nbsp;{link_html}</span>')

    # Første er live-item (skjermleser + tab-order). Resten er visuell fyll.
    first_item = build_item(is_copy=False)
    copy_item = build_item(is_copy=True)
    viewport_items = "\n      ".join(
        [first_item] + [copy_item] * (MARQUEE_LOOP_COPIES - 1)
    )
    aside_aria = bi_attr("aria-label", "siste post", "latest post")
    return f'''<!-- MARQUEE — annonseringsbånd for nyeste post. Portert fra
     rhode-staging 2026-07-09 (Mission Marquee). Slug/tittel er build-time-
     generert fra posts[0]; oppdaterer seg selv når ny post ships.
     Synlig pause-button fjernet 2026-07-19 (CEO-korreksjon); pause-mekanisme
     nå usynlig: hover/touch/focus-within pauser animasjonen (WCAG 2.2.2
     dekket via CSS :hover + :focus-within + JS touchstart/end + prefers-
     reduced-motion runtime i blog.js). -->
<aside class="marquee"{aside_aria}>
  <div class="marquee__viewport">
      {viewport_items}
  </div>
</aside>'''


# ─────────────────────────────────────────────
# Markup-varianter: artikkelkropp
# ─────────────────────────────────────────────

def post_nav_html(other, root=""):
    """Kryss-lenke til neste eldre post (med wrap). Markup fra renderBlog."""
    title_no = other.get("nav_title_no", other["title_no"])
    title_en = other.get("nav_title_en", other["title_en"])
    date_no = other.get("nav_date_label_no", other.get("date_label_no", other["date"]))
    date_en = other.get("nav_date_label_en", other.get("date_label_en", other["date"]))
    return f'''<div class="post-nav fade-in" role="navigation" aria-label="Andre innlegg" data-aria-no="Andre innlegg" data-aria-en="Other posts">
    <a href="{root}{other["slug"]}.html" class="post-nav-link">
      <span class="post-nav-label">{bi("les også", "also read")}</span>
      <span class="post-nav-title">{bi_text(title_no, title_en)}</span>
      <span class="post-nav-date">{bi_text(date_no, date_en)}</span>
    </a>
  </div>'''


def render_index_body(post, other):
    """Artikkelkropp, index-varianten (renderBlog 1:1, statisk tospråklig)."""
    m = post
    html = []

    # ::disclosure standing pattern (CEO 2026-07-18): mini-linje (whisper) rett
    # etter header + full <aside class="affiliate-disclosure"> RETT ETTER foerste
    # figure. build.py auto-flytter aside-plasseringen slik at source-rekkefolgen
    # av ::disclosure blir irrelevant. Whisper-tekst overstyres per-post via
    # whisper_no/whisper_en pa selve disclosure-blokken; ellers default under.
    disclosure_block = next(
        (b for b in m["_blocks"] if b["type"] == "disclosure"), None
    )

    # header (fra frontmatter — tilsvarer 'header'-blokken).
    # CEO 2026-07-19 for post 4: disclosure kan sette byline_marker_no/en
    # (f.eks. "REKLAME") som appendes til byline paa én kombinert linje —
    # grn//red-spec at markoren alltid er i foerste viewport (header-blokka).
    # Uten byline_marker: bevar 2-linje default header (backward-compat).
    byline_marker_no = ""
    byline_marker_en = ""
    if disclosure_block is not None:
        byline_marker_no = disclosure_block.get("byline_marker_no", "")
        byline_marker_en = disclosure_block.get("byline_marker_en", "")
    if byline_marker_no or byline_marker_en:
        no_parts = [m["kicker_no"], m["date_label_no"]]
        if byline_marker_no:
            no_parts.append(byline_marker_no)
        en_parts = [m["kicker_en"], m["date_label_en"]]
        if byline_marker_en:
            en_parts.append(byline_marker_en)
        # Middle-dot U+00B7 separator (typografisk byline-mønster).
        combined_no = " · ".join(no_parts)
        combined_en = " · ".join(en_parts)
        html.append(f'''<div class="fade-in">
          <p class="article-meta">{bi_text(combined_no, combined_en)}</p>
          <h1 class="article-title">{bi_text(m["title_no"], m["title_en"])}</h1>
        </div>''')
    else:
        html.append(f'''<div class="fade-in">
          <p class="article-meta">{bi_text(m["kicker_no"], m["kicker_en"])}</p>
          <h1 class="article-title">{bi_text(m["title_no"], m["title_en"])}</h1>
          <p class="article-meta" style="margin-top: 8px;">{bi_text(m["date_label_no"], m["date_label_en"])}</p>
        </div>''')
    html.append('<div class="article-body">')

    # Whisper-linje (typografisk hvisken, ikke banner). Foerste ting leseren
    # moeter. Muted --text-light, 12px, ingen boks/ramme. Full aside kommer
    # rett etter foerste figure. Emiteres kun naar ::disclosure eksisterer
    # OG blokka ikke har suppress_whisper: true (CEO 2026-07-19 for post 4:
    # aside alene under hero er tilstrekkelig annonse-anker, dobbel plassering
    # er off UI. Post 3 uendret — den mangler suppress_whisper-flagg).
    if disclosure_block is not None:
        _suppress_val = str(disclosure_block.get("suppress_whisper", "")).lower()
        suppress_whisper = _suppress_val in ("true", "yes", "1")
        if not suppress_whisper:
            whisper_no = disclosure_block.get(
                "whisper_no",
                "Reklame: innlegget inneholder annonselenker og rabattkode."
            )
            whisper_en = disclosure_block.get(
                "whisper_en",
                "Ad disclosure: this post contains affiliate links and a discount code."
            )
            html.append(
                '<p class="affiliate-whisper fade-in" role="note" aria-label="Reklame">'
                + bi_text(whisper_no, whisper_en)
                + '</p>'
            )

    def _render_disclosure_aside(b):
        """Full disclosure-aside. Bevart 1:1 fra tidligere elif-gren."""
        inner_parts = []
        i = 1
        while b.get(f"p{i}_no"):
            inner_parts.append(f"<p>{block_bi(b, f'p{i}_no', f'p{i}_en')}</p>")
            i += 1
        inner = "".join(inner_parts) if inner_parts else block_bi(b)
        return (
            f'<aside class="affiliate-disclosure fade-in" role="note"'
            f' aria-label="Reklame">{inner}</aside>'
        )

    disclosure_pending = disclosure_block is not None

    def _flush_disclosure_after_figure():
        """Kall RETT ETTER en figure-emit (image/video/image-pair). Emiterer
        aside-en akkurat en gang, uansett hvor mange figurer som foelger."""
        nonlocal disclosure_pending
        if disclosure_pending:
            html.append(_render_disclosure_aside(disclosure_block))
            disclosure_pending = False

    for b in m["_blocks"]:
        t = b["type"]
        if t == "disclosure":
            # Emiteres auto rett etter foerste figure. Aldri i source-rekkefolge.
            continue
        if t == "paragraph":
            # Bilingual paragrafer: standard-mønster (både no+en) rendrer som
            # ett <p> med .l-no/.l-en-spans inne. Single-språk-blokker (fra
            # kladd med separate NO/EN-avsnitt) rendrer som ett <p> med
            # klasse .l-no eller .l-en så CSS-language-toggle skjuler hele
            # avsnittet i motsatt språk (ikke bare innholdet).
            has_no = b.get("no") is not None
            has_en = b.get("en") is not None
            if has_no and has_en:
                html.append(f'''<div class="fade-in">
          <p>{block_bi(b)}</p>
        </div>''')
            elif has_no:
                content = b["no"] if b.get("html") == "true" else esc_text(b["no"])
                html.append(f'''<div class="fade-in">
          <p class="l-no">{content}</p>
        </div>''')
            elif has_en:
                content = b["en"] if b.get("html") == "true" else esc_text(b["en"])
                html.append(f'''<div class="fade-in">
          <p class="l-en">{content}</p>
        </div>''')
        elif t == "tagline-code":
            html.append(f'''<div class="fade-in">
          <p class="tagline tagline-code">{block_bi(b)}</p>
        </div>''')
        elif t == "tagline-statement":
            html.append(f'''<div class="fade-in">
          <p class="tagline-statement">{block_bi(b)}</p>
        </div>''')
        elif t == "section-label":
            html.append(f'''<div class="fade-in">
          <p class="section-label">{block_bi(b)}</p>
        </div>''')
        elif t == "pull-quote":
            html.append(f'''<div class="fade-in">
          <p class="pull-quote">{block_bi(b)}</p>
        </div>''')
        elif t == "image":
            style = f' style="object-position:{attr(b["object_position"])}"' if b.get("object_position") else ""
            # hero: true -> ubeskaaret hoyde (post 4 parkert-havna CEO 260718).
            # Legger til .article-image--hero-full som overrider max-height 50vh.
            hero_cls = " article-image--hero-full" if str(b.get("hero", "")).lower() == "true" else ""
            fig = (f'<figure class="article-image{hero_cls} fade-in">\n'
                   f'          <img src="{attr(b["src"])}"{bi_attr("alt", b["alt_no"], b["alt_en"])} loading="lazy"{style}>')
            if b.get("caption_no"):
                fig += f'<figcaption>{block_bi(b, "caption_no", "caption_en")}</figcaption>'
            fig += "</figure>"
            html.append(fig)
            _flush_disclosure_after_figure()
        elif t == "video":
            poster = f' poster="{attr(b["poster"])}"' if b.get("poster") else ""
            muted = " muted" if b.get("audio") == "false" else ""
            style = f' style="object-position:{attr(b["object_position"])}"' if b.get("object_position") else ""
            aria = bi_attr("aria-label", b.get("alt_no", ""), b.get("alt_en", "")) if b.get("alt_no") else ' aria-label=""'
            # preload: default "metadata" (post 3 mirror-selfie backward compat);
            # optional block-level override for research-spec compliance (post 4:
            # preload="none" per d33p-visual-density-research 260705).
            preload = attr(b.get("preload", "metadata"))
            # hero: true -> ubeskaaret hoyde (post 4 ponytail hero video CEO 260719).
            # CSS .article-image--hero-full-regelen daekker allerede video via
            # doble-selektor `.article-image--hero-full img, .article-image--hero-full video`.
            hero_cls = " article-image--hero-full" if str(b.get("hero", "")).lower() == "true" else ""
            # webm_src: optional secondary source for WebM fallback (d33p-research).
            # Naar satt, bruk <source>-children i stedet for src-attributt paa <video>.
            # Ellers: bevar postens 3 single-src-attributt-mønster uendret.
            webm_src = b.get("webm_src", "").strip()
            if webm_src:
                sources = (
                    f'<source src="{attr(webm_src)}" type="video/webm">'
                    f'<source src="{attr(b["src"])}" type="video/mp4">'
                )
                fig = (f'<figure class="article-image{hero_cls} fade-in">\n'
                       f'          <video{poster} controls preload="{preload}" playsinline{muted}{aria}{style}>{sources}</video>')
            else:
                fig = (f'<figure class="article-image{hero_cls} fade-in">\n'
                       f'          <video src="{attr(b["src"])}"{poster} controls preload="{preload}" playsinline{muted}{aria}{style}></video>')
            if b.get("caption_no"):
                fig += f'<figcaption>{block_bi(b, "caption_no", "caption_en")}</figcaption>'
            fig += "</figure>"
            html.append(fig)
            _flush_disclosure_after_figure()
        elif t == "image-pair":
            fig = '<figure class="image-pair fade-in">'
            n = 1
            while b.get(f"src_{n}"):
                fig += f'<img src="{attr(b[f"src_{n}"])}"{bi_attr("alt", b[f"alt_{n}_no"], b[f"alt_{n}_en"])} loading="lazy">'
                n += 1
            if b.get("caption_no"):
                fig += f'<figcaption>{block_bi(b, "caption_no", "caption_en")}</figcaption>'
            fig += "</figure>"
            html.append(fig)
            _flush_disclosure_after_figure()
        elif t == "inline-promo":
            html.append('''<div class="inline-promo fade-in">
          <a href="https://nextelite.no/boxing/?lang=no" target="_blank" rel="noopener" data-boxing-link>
            <img class="inline-promo-img" src="img/boxing-bodo-ring-purple.jpg" alt="NextElite" loading="lazy">
            <div class="inline-promo-body">
              <div class="inline-promo-label">NEXTELITE</div>
              <div class="inline-promo-sub">gloves on</div>
            </div>
          </a>
        </div>''')
        elif t == "spotify-card":
            # Statisk lenke-kort (aldri iframe/embed per GDPR-prinsipp).
            # CEO 260719 restyle: Spotify-feeling layout — moerkt kort, stort artwork,
            # tydelig tekst-hierarki. Vertikal stack (cover paa topp, tekst nederst)
            # istedenfor tidligere horisontal cream-warm design (CEO screenshot viste
            # kortet med usynlig tekst i grå stripe — restyle med div-nodes for
            # sikker block-level layout, ikke inline spans som feilkollapser).
            title = block_bi(b, "title_no", "title_en")
            subtitle = block_bi(b, "subtitle_no", "subtitle_en")
            has_label = b.get("label_no") is not None or b.get("label_en") is not None
            label_html = ""
            if has_label:
                label_html = f'<p class="section-label">{block_bi(b, "label_no", "label_en")}</p>\n  '
            href = attr(b["href"])
            img_src = attr(b["image"])
            img_alt = bi_attr("alt", b.get("image_alt_no", ""), b.get("image_alt_en", "")) if b.get("image_alt_no") else ' alt=""'
            source_text = esc_text(b.get("source", "Spotify"))
            html.append(
                f'<div class="spotify-card-wrap fade-in">\n'
                f'  {label_html}<a class="spotify-card" href="{href}" rel="noopener" target="_blank">\n'
                f'    <img class="spotify-card__cover" src="{img_src}"{img_alt} loading="eager" decoding="async">\n'
                f'    <div class="spotify-card__title">{title}</div>\n'
                f'    <div class="spotify-card__subtitle">{subtitle}</div>\n'
                f'    <div class="spotify-card__source">{source_text}</div>\n'
                f'  </a>\n'
                f'</div>'
            )
        elif t == "sign-off":
            # Safety-flush: post uten figurer far aside-en her, foer sign-off.
            _flush_disclosure_after_figure()
            # Signatur: lite hult hjerte i border-farge, forskjovet til siden (CEO 260720).
            html.append('''<div class="fade-in">
          <p class="sign-off"><svg class="sign-off-heart" viewBox="0 0 204.193381 204.000000" fill="currentColor" aria-hidden="true"><g transform="translate(-62.599879,212.000000) scale(0.100000,-0.100000)"><path d="M925 2106 c-51 -19 -118 -62 -151 -98 -40 -41 -104 -142 -104 -162 0 -8 -4 -17 -9 -20 -32 -20 -48 -306 -22 -416 20 -88 69 -209 121 -295 16 -27 37 -63 46 -80 29 -52 138 -197 177 -234 20 -20 37 -40 37 -44 0 -5 57 -72 126 -150 70 -78 149 -167 175 -197 27 -30 95 -113 150 -183 56 -71 112 -132 126 -138 13 -5 42 -9 63 -9 30 0 43 6 63 30 14 16 29 40 32 52 8 27 29 75 62 143 26 52 158 245 278 404 38 51 81 110 95 130 35 51 79 109 117 155 18 22 33 43 33 48 0 4 24 41 53 81 114 156 192 302 203 380 3 23 14 53 24 67 9 14 20 41 24 60 22 113 28 175 21 244 -6 66 -11 80 -36 105 -16 16 -29 36 -29 44 0 19 -26 41 -86 71 -41 21 -67 26 -122 26 -39 0 -74 -4 -77 -10 -3 -5 -16 -10 -29 -10 -30 0 -149 -62 -212 -111 -57 -44 -178 -172 -221 -234 -38 -55 -60 -94 -126 -218 -11 -21 -23 -35 -27 -30 -4 4 -27 51 -51 103 -58 126 -99 190 -178 278 -67 75 -177 162 -205 162 -8 0 -17 4 -21 9 -8 14 -65 41 -86 41 -10 0 -21 5 -24 10 -8 13 -172 11 -210 -4z m1508 -196 c13 -11 28 -31 31 -45 10 -40 -14 -162 -49 -250 -7 -16 -18 -45 -25 -64 -21 -53 -94 -179 -149 -258 -28 -39 -51 -76 -51 -82 0 -5 -6 -14 -14 -18 -12 -7 -123 -160 -274 -377 -113 -162 -209 -313 -231 -361 -20 -45 -61 -56 -61 -17 0 10 -18 40 -41 67 -22 27 -45 58 -51 69 -6 11 -57 74 -112 139 -56 64 -119 139 -141 166 -22 27 -83 100 -135 162 -116 137 -143 176 -201 284 -18 33 -36 67 -40 75 -19 34 -39 115 -45 178 -11 118 23 227 89 285 27 24 39 27 99 27 37 0 70 -4 73 -10 3 -5 13 -10 21 -10 28 0 155 -102 219 -177 36 -42 65 -81 65 -86 0 -6 6 -18 14 -26 25 -30 106 -201 106 -226 0 -7 4 -16 9 -19 5 -3 11 -23 14 -43 2 -21 11 -63 20 -94 9 -30 19 -79 23 -108 10 -74 40 -115 87 -119 32 -3 39 1 55 28 11 17 22 61 26 98 4 37 11 83 16 102 5 19 17 67 25 105 9 39 30 97 46 129 16 33 29 63 29 69 0 5 10 23 23 40 12 17 27 39 32 48 31 52 100 131 151 175 130 111 178 139 259 154 61 11 61 11 88 -10z"/></g></svg></p>
        </div>''')
            html.append("</div>")  # lukk .article-body
        else:
            sys.exit(f"{m['_path']}: ukjent blokktype i index-variant: {t!r}")

    html.append(post_nav_html(other))
    return "".join(html)


def render_vega_body(post, other):
    """Artikkelkropp, vega-varianten (renderPost 1:1, escapeHtml på all tekst)."""
    m = post
    html = []

    # hero (fra frontmatter)
    html.append(f'''<div class="fade-in">
          <p class="article-meta">{bi_esc(m["kicker_no"], m["kicker_en"])}</p>
          <h1 class="article-title">{bi_esc(m["title_no"], m["title_en"])}</h1>
          <p class="article-meta" style="margin-top: 8px;">{bi_esc(m["date_label_no"], m["date_label_en"])}</p>
        </div>''')
    html.append(f'''<figure class="article-header-image fade-in">
          <img src="{attr(m["header_image"])}"{bi_attr("alt", m["header_image_alt_no"], m["header_image_alt_en"])} loading="eager">
          <figcaption>{bi_esc(m["header_image_caption_no"], m["header_image_caption_en"])}</figcaption>
        </figure>''')
    html.append('<div class="article-body">')

    for b in m["_blocks"]:
        t = b["type"]
        if t == "paragraph":
            html.append(f'<div class="fade-in"><p>{bi_esc(b["no"], b["en"])}</p></div>')
        elif t == "section-label":
            html.append(f'<div class="fade-in"><p class="section-label">{bi_esc(b["no"], b["en"])}</p></div>')
        elif t == "tagline-statement":
            html.append(f'<div class="fade-in"><p class="tagline-statement">{bi_esc(b["no"], b["en"])}</p></div>')
        elif t == "tagline-code":
            html.append(f'<div class="fade-in"><p class="tagline-code">{bi_esc(b["no"], b["en"])}</p></div>')
        elif t == "pull-quote":
            html.append(f'<div class="fade-in"><p class="pull-quote">{bi_esc(b["no"], b["en"])}</p></div>')
        elif t == "image":
            fig = (f'<figure class="article-image fade-in">\n'
                   f'          <img src="{attr(b["src"])}"{bi_attr("alt", b["alt_no"], b["alt_en"])} loading="lazy">')
            if b.get("caption_no"):
                fig += f'<figcaption>{bi_esc(b["caption_no"], b["caption_en"])}</figcaption>'
            fig += "</figure>"
            html.append(fig)
        elif t == "video":
            poster = attr(b.get("poster", ""))
            fig = (f'<figure class="article-image fade-in">\n'
                   f'          <video src="{attr(b["src"])}" poster="{poster}" controls playsinline preload="metadata" '
                   f'style="width:100%;max-height:70vh;border-radius:4px;display:block;"></video>')
            if b.get("caption_no"):
                fig += f'<figcaption>{bi_esc(b["caption_no"], b["caption_en"])}</figcaption>'
            fig += "</figure>"
            html.append(fig)
        elif t == "post-footer":
            html.append(f'<div class="post-footer fade-in">{bi_esc(b["no"], b["en"])}</div>')
            html.append("</div>")  # lukk .article-body
        else:
            sys.exit(f"{m['_path']}: ukjent blokktype i vega-variant: {t!r}")

    html.append(post_nav_html(other))
    return "".join(html)


# ─────────────────────────────────────────────
# Head-metadata + JSON-LD
# ─────────────────────────────────────────────

def og_image_abs(post):
    img = post["og_image"]
    return img if img.startswith("http") else f"{SITE}/{img}"


def og_image_extra(post):
    out = ""
    if post.get("og_image_width"):
        out += f'<meta property="og:image:width" content="{attr(post["og_image_width"])}">\n'
        out += f'<meta property="og:image:height" content="{attr(post["og_image_height"])}">\n'
    if post.get("og_image_alt"):
        out += f'<meta property="og:image:alt" content="{attr(post["og_image_alt"])}">\n'
    return out


def jsonld_for_post(post):
    blogposting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post["title_no"],
        "author": {"@type": "Person", "name": "Neminee", "url": SITE},
        "datePublished": post["date"],
        "dateModified": post.get("modified", post["date"]),
        "image": og_image_abs(post),
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {"@type": "ImageObject", "url": PUBLISHER_LOGO},
        },
        "description": post["description"],
        "inLanguage": ["nb", "en"],
        "mainEntityOfPage": {"@type": "WebPage", "@id": canonical_url(post)},
    }
    if post.get("keywords"):
        blogposting["keywords"] = post["keywords"]
    if post.get("section"):
        blogposting["articleSection"] = post["section"]
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": SITE_NAME, "item": SITE},
            {"@type": "ListItem", "position": 2, "name": post["title_no"],
             "item": canonical_url(post)},
        ],
    }
    # `</` → `<\/` er standard JSON-in-script-mitigering: hindrer at et
    # `</script>` i frontmatter-tekst stenger script-blokken tidlig.
    # JSON-spec tillater \/ — payloaden er semantisk identisk.
    return (
        '<script type="application/ld+json">\n'
        + json.dumps(blogposting, indent=2, ensure_ascii=False).replace("</", "<\\/")
        + "\n</script>\n"
        + '<script type="application/ld+json">\n'
        + json.dumps(breadcrumb, indent=2, ensure_ascii=False).replace("</", "<\\/")
        + "\n</script>"
    )


def iso_time(date_str):
    d = datetime.date.fromisoformat(date_str)
    off, _ = oslo_offset(d)
    return f"{date_str}T00:00:00{off}"


# ─────────────────────────────────────────────
# Sidebygging
# ─────────────────────────────────────────────

def sidebar_playlist_html(post):
    """Rail-kort for spilleliste: samme feature som gloves-on-promoen, men
    playlist-innhold (CEO 260719). Genereres KUN for poster med ::spotify-card
    -blokk; data gjenbrukes derfra (ingen dobbel sannhet)."""
    b = next((x for x in post["_blocks"] if x["type"] == "spotify-card"), None)
    if b is None:
        return ""
    return f"""<!-- sidebar promo -- spilleliste -->
<aside class="sidebar-promo sidebar-promo--playlist" aria-label="Spilleliste">
  <a href="{attr(b["href"])}" target="_blank" rel="noopener noreferrer">
    <img class="sidebar-promo-img" src="{attr(b["image"])}" alt="" loading="lazy">
    <div class="sidebar-promo-body">
      <div class="sidebar-promo-label">{esc_text(b.get("title_no", ""))}</div>
      <div class="sidebar-promo-sub">{block_bi(b, "label_no", "label_en")}</div>
      <div class="sidebar-promo-cta">Spotify <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></div>
    </div>
  </a>
</aside>"""


def build_post_page(post, other, tpl, latest):
    variant = post.get("variant", "index")
    if variant == "vega":
        content = render_vega_body(post, other)
        body_class = ' class="v-vega has-marquee"'
        nav = nav_html("vega", "post")
    else:
        content = render_index_body(post, other)
        body_class = ' class="has-marquee"'
        nav = nav_html("index", "post")

    out = tpl
    # frontmatter-felter inn i attributt-/tekst-kontekst i template: kvote-
    # sikker escaping (BLOCKER-001). CANONICAL/tider/nav er build.py-styrt.
    repl = {
        "{{DESCRIPTION}}": attr(post["description"]),
        "{{CANONICAL}}": canonical_url(post),
        "{{OG_TITLE}}": attr(f"{post['title_no']} / {SITE_NAME}"),
        "{{OG_IMAGE}}": attr(og_image_abs(post)),
        "{{OG_IMAGE_EXTRA}}": og_image_extra(post),
        "{{PUBLISHED_TIME}}": iso_time(post["date"]),
        "{{MODIFIED_TIME}}": iso_time(post.get("modified", post["date"])),
        "{{SECTION}}": attr(post.get("section", "Blog")),
        "{{JSONLD}}": jsonld_for_post(post),
        "{{BODY_CLASS}}": body_class,
        "{{NAV}}": nav,
        "{{CONTENT}}": content,
        "{{FOOTER_LABEL}}": attr(post.get("footer_label", SITE_FOOTER_LABEL)),
        "{{SIDEBAR_PLAYLIST}}": sidebar_playlist_html(post),
        "{{MARQUEE}}": marquee_html(latest),
    }
    for k, v in repl.items():
        out = out.replace(k, v)
    write_out(f"{post['slug']}.html", out)


def build_index_page(posts, tpl):
    latest = posts[0]
    other = posts[1] if len(posts) > 1 else posts[0]
    content = render_index_body(latest, other)
    slug_map = {p["slug"]: 1 for p in posts}
    repl = {
        "{{REDIRECT_SLUGS}}": json.dumps(slug_map),
        "{{OG_TITLE}}": attr(latest["title_no"]),
        "{{OG_DESCRIPTION}}": attr(latest["description"]),
        "{{OG_IMAGE}}": attr(og_image_abs(latest)),
        "{{OG_IMAGE_EXTRA}}": og_image_extra(latest),
        "{{LATEST_SLUG}}": latest["slug"],
        "{{MARQUEE}}": marquee_html(latest),
        "{{NAV}}": nav_html("index", "home"),
        "{{CONTENT}}": content,
        "{{FOOTER_LABEL}}": SITE_FOOTER_LABEL,
    }
    out = tpl
    for k, v in repl.items():
        out = out.replace(k, v)
    write_out("index.html", out)


def arkiv_list_item(post, root="../"):
    title = bi_text(post.get("nav_title_no", post["title_no"]),
                    post.get("nav_title_en", post["title_en"]))
    date = bi_text(post.get("date_label_no", post["date"]),
                   post.get("date_label_en", post["date"]))
    return (f'      <div class="fade-in"><p>'
            f'<a href="{root}{post["slug"]}.html" class="post-nav-link">'
            f'<span class="post-nav-title">{title}</span>'
            f'<span class="post-nav-date">{date}</span></a></p></div>')


def build_arkiv_pages(posts, tpl):
    years = sorted({p["_date"].year for p in posts}, reverse=True)

    # arkiv/index.html — alle år
    sections = []
    for y in years:
        sections.append(f'      <div class="fade-in"><p class="section-label">'
                        f'<a href="{y}.html">{y}</a></p></div>')
        for p in [p for p in posts if p["_date"].year == y]:
            sections.append(arkiv_list_item(p))
    repl = {
        "{{DESCRIPTION}}": "Alle innlegg fra nextelite-bloggen.",
        "{{CANONICAL}}": f"{SITE}/arkiv/",
        "{{OG_TITLE}}": f"arkiv. / {SITE_NAME}",
        "{{ROOT}}": "../",
        "{{NAV}}": nav_html("index", "arkiv", root="../"),
        "{{ARKIV_TITLE}}": bi("arkiv.", "archive."),
        "{{POST_LIST}}": "\n".join(sections),
        "{{FOOTER_LABEL}}": SITE_FOOTER_LABEL,
        "{{MARQUEE}}": marquee_html(posts[0], root="../"),
    }
    out = tpl
    for k, v in repl.items():
        out = out.replace(k, v)
    write_out(os.path.join("arkiv", "index.html"), out)

    # arkiv/<år>.html
    for y in years:
        items = [arkiv_list_item(p) for p in posts if p["_date"].year == y]
        repl = {
            "{{DESCRIPTION}}": f"Innlegg fra {y} på nextelite-bloggen.",
            "{{CANONICAL}}": f"{SITE}/arkiv/{y}",
            "{{OG_TITLE}}": f"{y}. / {SITE_NAME}",
            "{{ROOT}}": "../",
            "{{NAV}}": nav_html("index", "arkiv", root="../"),
            "{{ARKIV_TITLE}}": str(y) + ".",
            "{{POST_LIST}}": "\n".join(items),
            "{{FOOTER_LABEL}}": SITE_FOOTER_LABEL,
            "{{MARQUEE}}": marquee_html(posts[0], root="../"),
        }
        out = tpl
        for k, v in repl.items():
            out = out.replace(k, v)
        write_out(os.path.join("arkiv", f"{y}.html"), out)


def build_sitemap(posts):
    latest_mod = max(p.get("modified", p["date"]) for p in posts)
    years = sorted({p["_date"].year for p in posts}, reverse=True)
    urls = []

    def url(loc, lastmod=None, changefreq=None, priority=None, hreflang=False):
        out = ["  <url>", f"    <loc>{loc}</loc>"]
        if lastmod:
            out.append(f"    <lastmod>{lastmod}</lastmod>")
        if changefreq:
            out.append(f"    <changefreq>{changefreq}</changefreq>")
        if priority:
            out.append(f"    <priority>{priority}</priority>")
        if hreflang:
            out.append(f'    <xhtml:link rel="alternate" hreflang="nb" href="{loc}"/>')
            out.append(f'    <xhtml:link rel="alternate" hreflang="en" href="{loc}"/>')
        out.append("  </url>")
        urls.append("\n".join(out))

    url(f"{SITE}/", latest_mod, "weekly", "1.0", hreflang=True)
    for p in posts:
        url(canonical_url(p), p.get("modified", p["date"]), "monthly", "0.9", hreflang=True)
    url(f"{SITE}/arkiv/", latest_mod, "monthly", "0.3", hreflang=True)
    for y in years:
        url(f"{SITE}/arkiv/{y}", latest_mod, "monthly", "0.3", hreflang=True)
    for path in STATIC_SECTIONS:
        url(f"{SITE}{path}", None, "monthly", "0.5")

    out = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        "<!-- generert av build.py -->\n"
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n'
        + "\n\n".join(urls)
        + "\n\n</urlset>\n"
    )
    write_out("sitemap.xml", out)


def build_feed(posts):
    def xml_esc(s):
        return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

    items = []
    for p in posts:
        d = p["_date"]
        _, tz = oslo_offset(d)
        dt = datetime.datetime(d.year, d.month, d.day, tzinfo=tz)
        items.append(f"""    <item>
      <title>{xml_esc(p["title_no"])}</title>
      <link>{canonical_url(p)}</link>
      <guid isPermaLink="true">{canonical_url(p)}</guid>
      <pubDate>{format_datetime(dt)}</pubDate>
      <description>{xml_esc(p["description"])}</description>
    </item>""")

    # lastBuildDate = naar innholdet sist endret seg. RSS-konvensjon
    # (RFC 4287/2822): tidspunktet feeden ble sist GENERERT med faktisk
    # innholds-endring. Bruker max(mtime) av .md-filene i content/posts/
    # heller enn nyeste post-DATO. To grunner:
    #   1. En post kan editeres uten at frontmatter-date endres
    #      (typo-fiks, bilde-bytte). lastBuildDate maa fange det.
    #   2. Frontmatter-date == publiseringsdato, ikke siste-touch.
    # CI-determinisme bevart: git checkout setter mtime til checkout-tid
    # for ALLE filer, saa max(mtime) blir konstant per CI-kjoering.
    last_touch = datetime.datetime.fromtimestamp(
        max(os.path.getmtime(p["_path"]) for p in posts),
        tz=ZoneInfo("Europe/Oslo"),
    )
    now = last_touch
    out = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{SITE_NAME}</title>
    <link>{SITE}/</link>
    <description>{xml_esc(SITE_DESCRIPTION)}</description>
    <language>nb</language>
    <lastBuildDate>{format_datetime(now)}</lastBuildDate>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
{chr(10).join(items)}
  </channel>
</rss>
"""
    write_out("feed.xml", out)


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

def main():
    files = sorted(f for f in os.listdir(POSTS_DIR) if f.endswith(".md"))
    if not files:
        sys.exit("ingen poster i content/posts/")
    posts = [parse_post(os.path.join(POSTS_DIR, f)) for f in files]

    # draft: true frontmatter — post ekskluderes HELT fra build (ingen HTML,
    # ikke i index/arkiv/sitemap/feed). Uten feltet eller draft: false =
    # publiseres som før. Boolean-normalisering matcher affiliate-gaten i
    # parse_post: strict on ON, liberal on OFF. Uten denne gaten ville en
    # ferdigskrevet-men-uklar post ligge én push unna live.
    def is_draft(p):
        return str(p.get("draft", "")).strip().lower() in ("true", "yes", "1")
    drafts = [p for p in posts if is_draft(p)]
    posts = [p for p in posts if not is_draft(p)]
    if drafts:
        print(f"build.py: {len(drafts)} draft(s) ekskludert: "
              f"{', '.join(sorted(p['slug'] for p in drafts))}")
    if not posts:
        sys.exit("ingen publiserbare poster i content/posts/ (alle draft: true)")

    posts.sort(key=lambda p: (p["_date"], p["slug"]), reverse=True)

    slugs = [p["slug"] for p in posts]
    if len(slugs) != len(set(slugs)):
        sys.exit(f"duplikat slug: {slugs}")

    print(f"build.py: {len(posts)} poster")
    post_tpl = read_template("post.html")
    index_tpl = read_template("index.html")
    arkiv_tpl = read_template("arkiv.html")

    # post-sider — post-nav peker på neste eldre post, eldste wrapper til nyeste
    for i, p in enumerate(posts):
        other = posts[(i + 1) % len(posts)]
        build_post_page(p, other, post_tpl, posts[0])

    build_index_page(posts, index_tpl)
    build_arkiv_pages(posts, arkiv_tpl)
    build_sitemap(posts)
    build_feed(posts)
    print("build.py: OK")


if __name__ == "__main__":
    main()
