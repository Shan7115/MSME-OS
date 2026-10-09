#!/usr/bin/env bash
# MSMEOS one-command launcher for Linux and macOS.
# Creates the Python virtual environment, installs dependencies, builds the
# frontend and starts the app at http://127.0.0.1:8000
set -euo pipefail
cd "$(dirname "$0")"

PY="$(command -v python3 || command -v python || true)"
[ -n "$PY" ] || { echo "[error] Python 3.11+ not found." >&2; exit 1; }
"$PY" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)' \
  || { echo "[error] Python 3.11 or newer is required." >&2; exit 1; }
command -v npm >/dev/null || { echo "[error] Node.js 18+ (npm) not found." >&2; exit 1; }

if [ ! -f venv/bin/activate ]; then
  echo "[1/4] Creating virtual environment..."
  "$PY" -m venv venv
fi
# shellcheck disable=SC1091
source venv/bin/activate

echo "[2/4] Installing Python dependencies..."
python -m pip install --disable-pip-version-check -q -r requirements.txt

cd frontend
if [ ! -d node_modules ]; then
  echo "[3/4] Installing frontend dependencies..."
  npm install --no-audit --no-fund
else
  echo "[3/4] Frontend dependencies already installed."
fi
echo "      Building frontend..."
npm run build
cd ..

export HOST="${HOST:-127.0.0.1}" PORT="${PORT:-8000}"
echo "[4/4] Starting MSMEOS at http://$HOST:$PORT  (Ctrl+C to stop)"
( command -v xdg-open >/dev/null && xdg-open "http://$HOST:$PORT" ) >/dev/null 2>&1 || \
( command -v open >/dev/null && open "http://$HOST:$PORT" ) >/dev/null 2>&1 || true
exec python app.py
