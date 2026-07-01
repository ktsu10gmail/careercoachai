#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/ksu/recruit-system}"
LOG_FILE="${PROJECT_DIR}/frontend-runtime.log"
AGENCY_LOG_FILE="${PROJECT_DIR}/frontend-agency-runtime.log"
APPLICANT_LOG_FILE="${PROJECT_DIR}/frontend-applicant-runtime.log"

cd "$PROJECT_DIR"

echo "=========================================="
echo " Starting Career Coaching AI..."
echo "=========================================="

docker compose up -d

start_frontend_port() {
  local port="$1"
  local label="$2"
  local log_file="$3"

  if ss -ltn "sport = :${port}" | grep -q ":${port}"; then
    echo "[${label}] Port ${port} is already listening. Leaving it running."
  else
    echo "[${label}] Starting production frontend on http://localhost:${port}"
    FRONTEND_PORT="$port" nohup "$PROJECT_DIR/scripts/run_recruit_system_service.sh" > "$log_file" 2>&1 &
    echo "[${label}] Log file: $log_file"
  fi
}

start_frontend_port 3001 "Employer Frontend" "$LOG_FILE"
start_frontend_port 4001 "Agency Frontend" "$AGENCY_LOG_FILE"
start_frontend_port 5001 "Applicant Frontend" "$APPLICANT_LOG_FILE"

echo "=========================================="
echo " Career Coaching AI startup requested."
echo " Employer:       http://localhost:3001"
echo " Agency:         http://localhost:4001"
echo " Applicant:      http://localhost:5001"
echo " Backend Docs:   http://localhost:8000/docs"
echo "=========================================="
