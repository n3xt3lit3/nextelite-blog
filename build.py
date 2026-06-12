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

ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, "content", "posts")
TEMPLATES_DIR = os.path.join(ROOT, "templates")

SITE = "https://nextelite.no"
SITE_NAME = "nextelite"
SITE_DESCRIPTION = "nextelite. boxing, protocol, art. en blogg fra vesteralen."
SITE_FOOTER_LABEL = "uke 1 / 2026"  # forsidens live footer-tekst i dag
PUBLISHER_LOGO = SITE + "/img/boxing-topten-mirror.jpg"

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
    if meta.get("affiliate") == "true":
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

    # header (fra frontmatter — tilsvarer 'header'-blokken)
    html.append(f'''<div class="fade-in">
          <p class="article-meta">{bi_text(m["kicker_no"], m["kicker_en"])}</p>
          <h1 class="article-title">{bi_text(m["title_no"], m["title_en"])}</h1>
          <p class="article-meta" style="margin-top: 8px;">{bi_text(m["date_label_no"], m["date_label_en"])}</p>
        </div>''')
    html.append('<div class="article-body">')

    for b in m["_blocks"]:
        t = b["type"]
        if t == "paragraph":
            html.append(f'''<div class="fade-in">
          <p>{block_bi(b)}</p>
        </div>''')
        elif t == "disclosure":
            # Forbrukertilsynet-klarert aside (commit 647ce1d / 11dfa6e):
            # role="note" + aria-label="Reklame" for screen-reader-merking.
            # Innholdet kan ha flere ::p1/::p2-felter — slå sammen som
            # separate <p>-elementer for korrekt avstand (CSS-regel i
            # blog.css linje 312-313).
            inner_parts = []
            i = 1
            while b.get(f"p{i}_no"):
                inner_parts.append(f"<p>{block_bi(b, f'p{i}_no', f'p{i}_en')}</p>")
                i += 1
            inner = "".join(inner_parts) if inner_parts else block_bi(b)
            html.append(
                f'<aside class="affiliate-disclosure fade-in" role="note"'
                f' aria-label="Reklame">{inner}</aside>'
            )
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
            fig = (f'<figure class="article-image fade-in">\n'
                   f'          <img src="{attr(b["src"])}"{bi_attr("alt", b["alt_no"], b["alt_en"])} loading="lazy"{style}>')
            if b.get("caption_no"):
                fig += f'<figcaption>{block_bi(b, "caption_no", "caption_en")}</figcaption>'
            fig += "</figure>"
            html.append(fig)
        elif t == "video":
            poster = f' poster="{attr(b["poster"])}"' if b.get("poster") else ""
            muted = " muted" if b.get("audio") == "false" else ""
            style = f' style="object-position:{attr(b["object_position"])}"' if b.get("object_position") else ""
            aria = bi_attr("aria-label", b.get("alt_no", ""), b.get("alt_en", "")) if b.get("alt_no") else ' aria-label=""'
            fig = (f'<figure class="article-image fade-in">\n'
                   f'          <video src="{attr(b["src"])}"{poster} controls preload="metadata" playsinline{muted}{aria}{style}></video>')
            if b.get("caption_no"):
                fig += f'<figcaption>{block_bi(b, "caption_no", "caption_en")}</figcaption>'
            fig += "</figure>"
            html.append(fig)
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
        elif t == "sign-off":
            html.append('''<div class="fade-in">
          <p class="sign-off">&lt;333</p>
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

def build_post_page(post, other, tpl):
    variant = post.get("variant", "index")
    if variant == "vega":
        content = render_vega_body(post, other)
        body_class = ' class="v-vega"'
        nav = nav_html("vega", "post")
    else:
        content = render_index_body(post, other)
        body_class = ""
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
        max(os.path.getmtime(p["_path"]) for p in posts)
    )
    _, tz = oslo_offset(last_touch.date())
    now = last_touch.replace(tzinfo=tz)
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
        build_post_page(p, other, post_tpl)

    build_index_page(posts, index_tpl)
    build_arkiv_pages(posts, arkiv_tpl)
    build_sitemap(posts)
    build_feed(posts)
    print("build.py: OK")


if __name__ == "__main__":
    main()
