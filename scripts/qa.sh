#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

"$ROOT_DIR/scripts/check.sh"
"$ROOT_DIR/scripts/validate-ui.sh"
"$ROOT_DIR/scripts/validate-db.sh"

echo "QA 하네스 완료"
