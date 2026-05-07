# Branch Protection — `main`

GitHub krever at branch-protection-regler aktiveres via Web UI (CLI fungerer ikke for GitHub Pages-personal-repo uten Pro). Slik gjør CEO det:

## Steg-for-steg

1. Gå til: https://github.com/neminesteffensen/nextelite-blog/settings/branches
2. Klikk **Add rule** (eller **Add branch protection rule**).
3. **Branch name pattern**: `main`
4. Aktiver disse boksene:
   - [x] **Require a pull request before merging**
     - [x] Require approvals: `1` (valgfritt — kan stå `0` siden du er solo, men da virker review fra deg ikke som gate)
     - [x] Dismiss stale pull request approvals when new commits are pushed
   - [x] **Require status checks to pass before merging**
     - [x] Require branches to be up to date before merging
     - I søkefeltet: skriv `visual-regression` og velg den. (Sjekken må ha kjørt minst én gang før den dukker opp i listen — push astro-migrate først.)
   - [x] **Require linear history**
   - [x] **Do not allow bypassing the above settings**
   - [x] **Restrict who can push to matching branches** → la stå tom (ingen kan pushe direkte)
   - [x] **Do not allow force pushes**
   - [x] **Do not allow deletions**
5. Klikk **Create** / **Save changes**.

## Hva dette betyr i praksis

- Ingen kan pushe direkte til `main`. Alt går via PR.
- Hver PR må kjøre `visual-regression`-jobben (Playwright snapshot diff).
- Hvis en pixel endrer seg på en post uten at baseline-snapshotet er oppdatert i samme PR → **deploy blokkeres**.
- Force-push og branch-deletion er deaktivert. Historie kan ikke skrives om.

## Slik oppdaterer du baseline-snapshots (når du faktisk MENER å endre noe)

Lokalt:

```bash
cd astro-app
pnpm exec playwright test --update-snapshots
git add tests/__screenshots__/
git commit -m "Update visual baseline: <hva endret seg>"
```

Push til en branch, åpne PR mot `main`. CI kjører på nytt med de nye baselines, og hvis alt grønt → merge.

## Hva CEO faktisk får ut av dette

> "Hvis noe endrer seg på en post uten at jeg har godkjent det, går det ikke i produksjon."

Det er hele poenget. Sove tryggere.
