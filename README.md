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

All blokk-tekst escapes automatisk (`<` og `>` blir ufarlig tekst). Skal en
blokk inneholde ekte HTML (lenke, `<strong>`), legg til linja `html: true`
i blokken — da settes teksten inn rått, med vilje.

**Hvis Actions er rødt:** siten er ikke nede — main serverer alltid sist
committede HTML. Men den nye posten er ikke publisert. Kjør `python3 build.py
&& python3 tools/verify-build.py` lokalt, fiks feilen, og push ferdig output.

## Medierammer

Publiserte medier bruker `desktop_frame` (`desktop_frame_1`, `_2` for bildepar,
`header_frame` for Vega-header). Verdiene er `natural`, `portrait`, `hero`,
`tall`, `ponytail` og `vest`. Rammene viderefører de godkjente utsnittene fra
telefonreferansen 375×812; desktop skalerer rammen uten nye viewport-høyde-crops.
Telefonreglene, objektposisjonene og mediefilene bevares. Nye/redigerte medier
skal få en eksplisitt ramme etter visuell kontroll. `natural` følger kildefilens
proporsjoner; de øvrige bevarer redaksjonelt valgte utsnitt/relativ bredde.

APEX tilstandstester: `node tools/test-apex-playback.js`. De bruker en falsk
YouTube API for feilsituasjoner og erstatter ikke test med faktisk avspilling.
