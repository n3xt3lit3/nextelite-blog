# AGENTS.md — nextelite-blog

Statisk blogg på **nextelite.no**. Serveres av GitHub Pages fra `main` (repo-root er publisert HTML). Build går via `.github/workflows/build.yml` på push til `main`, men repoet inneholder alltid ferdig committet output, så main-HEAD er alltid canonical.

Hovedstyring bor i NextEliteOS-repoet (`CLAUDE.md` + `AGENTS.md` der). Denne fila er lokal disiplin for arbeid i **dette** repoet.

## Kommandoer

```bash
python3 build.py                 # bygger alt fra content/posts + templates + assets
python3 tools/verify-build.py    # 60 sjekker: URL- og innholdsbevaring. Exit 0 = trygt.
python3 -m http.server 8000      # lokal preview på http://localhost:8000/
```

Ingen dependencies. Ren Python 3 stdlib. Node/npm brukes ikke.

## Innholdskontrakt

- Poster ligger i `content/posts/YYYY-MM-DD-slug.md`. En fil per post.
- Frontmatter mellom `---`-linjer. Blokker starter med `::paragraph`, `::image`, `::video`, `::section-label`, `::pull-quote`, `::disclosure`.
- Tospråklig i samme fil: `no:`-linje og `en:`-linje per avsnitt.
- All blokk-tekst escapes automatisk. Rå HTML krever eksplisitt `html: true` i blokken.
- `variant: vega` i frontmatter gir forste-kamp-utseendet (scopede CSS-avvik).
- `draft: true` = post er usynlig for nettet per draft-gate i `build.py`. Standard for pågående arbeid. Fjern eller sett `draft: false` når posten skal publiseres.
- Publisert / kladd / eksperiment-konvensjon: se README §Struktur.

## Stil

- Vanilla HTML/CSS/JS. Ingen frameworks. Ingen build-steg utover `build.py`.
- Font: Inter + system-fallback. 12px minimum. 44px minimum touch targets.
- All farge går via CSS custom properties i `assets/blog.css`. Ingen hardkodede hex utenfor tokens.
- Ingen inline `style="..."` i HTML.
- Semantisk HTML. ARIA der det trengs.

## Stemme-vakt (kjøres FØR ship)

Utkast skal passere disse to i NextEliteOS-repoet:

```bash
python3 "/Users/neminesteffensen/Library/Mobile Documents/com~apple~CloudDocs/NextEliteOS/20-COMMAND/blog-voice-lint.py"  <post-fil>
python3 "/Users/neminesteffensen/Library/Mobile Documents/com~apple~CloudDocs/NextEliteOS/20-COMMAND/blog-voice-score.py" <post-fil>
```

## Review-gates (mandatory, i rekkefølge)

1. Post-utkast med `draft: true` → 2. `enc0re` code review → 3. `vrd1ct` QA → 4. `grn//red` legal-clearance hvis relevant → 5. CEO ja → 6. `draft`-flag fjernes, rebuild, push.

## Harde grenser

- **Aldri `git push` uten eksplisitt CEO-klarering.** Local commits er OK. Remote er Tier 3 minimum.
- Aldri innhold direkte i repo-rot. Kilden er `content/posts/`. Rot-HTML er generert output.
- Aldri manuelt redigert `*.html` i rot, `arkiv/`, `sitemap.xml` eller `feed.xml`. Det er build-output.
- Affiliate-lenker krever `::disclosure`-blokk i samme post.
- Ingen secrets i commits. Alle credentials via env-vars.
- Ingen påfunn i tekst. Faktasjekk per claim. Primary-source.

## Hvis Actions er rød

Siten går ikke ned — main serverer alltid siste committede HTML. Men den nye posten er ikke publisert. Kjør lokalt:

```bash
python3 build.py && python3 tools/verify-build.py
```

Fiks feilen. Commit ferdig output. Push.

## Peker til hovedstyring

Alt annet (agent-roster, decision tiers, brand-rules, voice-korreksjoner) styres fra `~/Library/Mobile Documents/com~apple~CloudDocs/NextEliteOS/CLAUDE.md` + `AGENTS.md`. Denne fila er scoped til dette repoet.
