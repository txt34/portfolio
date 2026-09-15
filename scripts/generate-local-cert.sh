#!/usr/bin/env bash
set -euo pipefail

mkdir -p "$(dirname "$0")/../certificates"
CERT_DIR="$(dirname "$0")/../certificates"
KEY_PATH="$CERT_DIR/key.pem"
CERT_PATH="$CERT_DIR/cert.pem"

if [ ! -f "$KEY_PATH" ] || [ ! -f "$CERT_PATH" ]; then
  openssl req -x509 -newkey rsa:2048 -keyout "$KEY_PATH" -out "$CERT_PATH" -days 365 -nodes -subj "/CN=localhost" >/dev/null 2>&1
fi

printf '%s\n' "$CERT_PATH"
