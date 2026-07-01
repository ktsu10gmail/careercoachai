#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/ksu/recruit-system}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"
FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
NVM_DIR="${NVM_DIR:-/home/ksu/.nvm}"

cd "$PROJECT_DIR"

echo "[Career Coaching AI] Waiting for Docker..."
for attempt in {1..60}; do
  if docker info >/dev/null 2>&1; then
    break
  fi
  if [ "$attempt" -eq 60 ]; then
    echo "[Career Coaching AI] Docker is not ready after 120 seconds." >&2
    exit 1
  fi
  sleep 2
done

echo "[Career Coaching AI] Starting backend, database, and Ollama containers..."
docker compose up -d

cd "$PROJECT_DIR/frontend"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use 20 >/dev/null || nvm use --lts >/dev/null || true
fi

if [ ! -d node_modules ]; then
  echo "[Career Coaching AI] Installing frontend dependencies..."
  npm install
fi

if [ ! -f .next/BUILD_ID ] || [ "${RECRUIT_SYSTEM_BUILD_ON_START:-0}" = "1" ]; then
  echo "[Career Coaching AI] Building frontend..."
  npm run build
fi

echo "[Career Coaching AI] Starting frontend on http://${FRONTEND_HOST}:${FRONTEND_PORT}"
exec npm run start -- -H "$FRONTEND_HOST" -p "$FRONTEND_PORT"
