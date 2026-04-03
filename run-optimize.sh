#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ensure_node() {
  if command -v node >/dev/null 2>&1; then
    echo "Node.js trovato."
    return
  fi

  echo "Node.js non trovato. Provo a installare la versione LTS..."

  if command -v brew >/dev/null 2>&1; then
    brew install node
    return
  fi

  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y nodejs npm
    return
  fi

  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nodejs npm
    return
  fi

  if command -v yum >/dev/null 2>&1; then
    sudo yum install -y nodejs npm
    return
  fi

  if command -v pacman >/dev/null 2>&1; then
    sudo pacman -Sy --noconfirm nodejs npm
    return
  fi

  echo "Impossibile installare automaticamente Node.js. Installalo manualmente e rilancia lo script."
  exit 1
}

ensure_node

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js ancora non disponibile dopo l'installazione. Chiudi e riapri il terminale, poi riprova."
  exit 1
fi

echo
echo "Running optimize.js..."
node optimize.js
echo
echo "[OK] optimize.js completato con successo."
