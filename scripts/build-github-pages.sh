#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export GITHUB_PAGES=1
export VITE_STATIC_PAGES=1
node scripts/with-app-env.mjs vite build
node scripts/copy-pglite-assets.mjs || true
STATIC_DIR=".vercel/output/static"
test -d "$STATIC_DIR"

# Prefer true client entry modules from the client environment build.
ENTRY=""
for pattern in 'index-*.js' 'main-*.js' 'entry-client-*.js'; do
  match=$(ls -1 "$STATIC_DIR"/assets/$pattern 2>/dev/null | head -1 || true)
  if [ -n "${match:-}" ]; then
    ENTRY=$(basename "$match")
    break
  fi
done
if [ -z "${ENTRY:-}" ]; then
  ENTRY=$(ls -1S "$STATIC_DIR"/assets/*.js | head -1 | xargs -n1 basename)
fi

CSS_TAGS=""
while IFS= read -r c; do
  [ -z "$c" ] && continue
  CSS_TAGS+="    <link rel=\"stylesheet\" crossorigin href=\"/jayota/assets/${c}\" />"$'\n'
done < <(ls -1 "$STATIC_DIR"/assets/*.css 2>/dev/null | xargs -n1 basename || true)

cat > "$STATIC_DIR/index.html" <<HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jayota — Hendrick Toyota Merriam</title>
    <link rel="icon" type="image/svg+xml" href="/jayota/favicon.svg" />
${CSS_TAGS}  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="/jayota/assets/${ENTRY}"></script>
  </body>
</html>
HTML
cp -f "$STATIC_DIR/index.html" "$STATIC_DIR/404.html"
echo "ENTRY=$ENTRY"
python3 - <<'PY'
from pathlib import Path
import re, sys
root = Path(".vercel/output/static")
html = (root / "index.html").read_text()
print(html)
hrefs = re.findall(r'(?:src|href)="([^"]+)"', html)
missing = []
for h in hrefs:
    if h.startswith(("http", "data:", "#")):
        continue
    path = h[len("/jayota/") :] if h.startswith("/jayota/") else h.lstrip("/")
    if not (root / path).exists():
        missing.append(h)
print("missing", missing)
if missing:
    sys.exit(1)
print("asset_check_ok")
print("js_count", len(list((root / "assets").glob("*.js"))))
PY
test -f "$STATIC_DIR/favicon.svg"
