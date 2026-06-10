# nextelite-blog

Statisk blogg på [nextelite.no](https://nextelite.no). Bygges av `build.py`
(ren Python 3 stdlib) fra `content/posts/` + `templates/` + `assets/`.
Repoet inneholder alltid ferdigbygd HTML — GitHub Pages serverer roten direkte.

## Ny post

1. Lag fila `content/posts/ÅÅÅÅ-MM-DD-slug.md` — kopier en eksisterende post som mal.
2. Skriv norsk og engelsk i samme fil: `no:`-linje og `en:`-linje per avsnitt.
3. Bilder legges i `img/`, og refereres som `src: img/filnavn.jpg`.
4. Kjør `python3 build.py` — forsiden, arkivet, sitemap og feed oppdateres selv.
5. Kjør `python3 tools/verify-build.py` — alt skal si PASS.
6. Commit alt og push til main. Ferdig.

**Frys-vedtak (2026-06-10):** Alle nye poster skrives som innholdsfiler i
`content/posts/`. Ingen nye JS-array-poster. Ingen kopier av index.html.

## Struktur

| Sti | Hva |
|---|---|
| `content/posts/` | Kilden. Én `.md`-fil per post, NO+EN sammen. |
| `templates/` | HTML-skall for post, forside og arkiv. |
| `assets/blog.css` | All stil. Blog-paletten er CEO-smak, egen fra brand-tokens. |
| `assets/blog.js` | Språkbryter, fade-in, nav-skjuling. |
| `build.py` | Generatoren. `python3 build.py`, ingen avhengigheter. |
| `tools/verify-build.py` | Beviser URL- og innholds-bevaring. Exit 0 = trygt. |
| `*.html`, `arkiv/`, `sitemap.xml`, `feed.xml` | Generert output — ikke rediger for hånd. |
| `boxing/`, `medlemskap/`, `personvern/`, `salgsbetingelser/` | Egne seksjoner, urørt av build. |

Innholdsformat: frontmatter mellom `---`-linjer, deretter blokker som starter
med `::paragraph`, `::image`, `::video`, `::section-label`, `::pull-quote` osv.
`variant: vega` i frontmatter gir forste-kamp-utseendet (scopede CSS-avvik).
