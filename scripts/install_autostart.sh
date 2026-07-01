#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/ksu/recruit-system}"
SERVICE_DIR="${HOME}/.config/systemd/user"
EMPLOYER_SERVICE_FILE="${SERVICE_DIR}/recruit-system.service"
AGENCY_SERVICE_FILE="${SERVICE_DIR}/recruit-system-agency.service"
APPLICANT_SERVICE_FILE="${SERVICE_DIR}/recruit-system-applicant.service"

mkdir -p "$SERVICE_DIR"

cat > "$EMPLOYER_SERVICE_FILE" <<SERVICE
[Unit]
Description=Career Coaching AI employer frontend and app stack
After=default.target

[Service]
Type=simple
WorkingDirectory=${PROJECT_DIR}
Environment=PROJECT_DIR=${PROJECT_DIR}
Environment=FRONTEND_HOST=0.0.0.0
Environment=FRONTEND_PORT=3001
Environment=NVM_DIR=${HOME}/.nvm
ExecStart=${PROJECT_DIR}/scripts/run_recruit_system_service.sh
Restart=always
RestartSec=5
TimeoutStartSec=180

[Install]
WantedBy=default.target
SERVICE

cat > "$AGENCY_SERVICE_FILE" <<SERVICE
[Unit]
Description=Career Coaching AI recruiting agency frontend
After=default.target

[Service]
Type=simple
WorkingDirectory=${PROJECT_DIR}
Environment=PROJECT_DIR=${PROJECT_DIR}
Environment=FRONTEND_HOST=0.0.0.0
Environment=FRONTEND_PORT=4001
Environment=NVM_DIR=${HOME}/.nvm
ExecStart=${PROJECT_DIR}/scripts/run_recruit_system_service.sh
Restart=always
RestartSec=5
TimeoutStartSec=180

[Install]
WantedBy=default.target
SERVICE

cat > "$APPLICANT_SERVICE_FILE" <<SERVICE
[Unit]
Description=Career Coaching AI applicant frontend
After=default.target

[Service]
Type=simple
WorkingDirectory=${PROJECT_DIR}
Environment=PROJECT_DIR=${PROJECT_DIR}
Environment=FRONTEND_HOST=0.0.0.0
Environment=FRONTEND_PORT=5001
Environment=NVM_DIR=${HOME}/.nvm
ExecStart=${PROJECT_DIR}/scripts/run_recruit_system_service.sh
Restart=always
RestartSec=5
TimeoutStartSec=180

[Install]
WantedBy=default.target
SERVICE

chmod 644 "$EMPLOYER_SERVICE_FILE" "$AGENCY_SERVICE_FILE" "$APPLICANT_SERVICE_FILE"
chmod +x "${PROJECT_DIR}/scripts/run_recruit_system_service.sh"

systemctl --user daemon-reload
systemctl --user enable recruit-system.service
systemctl --user enable recruit-system-agency.service
systemctl --user enable recruit-system-applicant.service

if command -v loginctl >/dev/null 2>&1; then
  if ! loginctl show-user "$USER" -p Linger 2>/dev/null | grep -q "Linger=yes"; then
    loginctl enable-linger "$USER" >/dev/null 2>&1 || true
  fi
fi

echo "Career Coaching AI autostart is installed."
echo "Start now:       systemctl --user start recruit-system.service recruit-system-agency.service recruit-system-applicant.service"
echo "Check employer:  systemctl --user status recruit-system.service"
echo "Check agency:    systemctl --user status recruit-system-agency.service"
echo "Check applicant: systemctl --user status recruit-system-applicant.service"
echo "View logs:       journalctl --user -u recruit-system.service -u recruit-system-agency.service -u recruit-system-applicant.service -f"
echo "Disable later:   systemctl --user disable --now recruit-system.service recruit-system-agency.service recruit-system-applicant.service"
