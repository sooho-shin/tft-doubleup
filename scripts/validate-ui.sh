#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f apps/web/package.json ]]; then
  echo "apps/web package.json이 없어 UI 검증을 실행할 수 없습니다."
  echo "웹 앱 스캐폴딩 후 Playwright 기반 validate:ui를 연결하세요."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm을 찾을 수 없어 UI 검증을 실행할 수 없습니다."
  echo "corepack enable && corepack prepare pnpm@10.11.0 --activate 후 다시 실행하세요."
  exit 1
fi

echo "Playwright 기반 실제 브라우저 UI 검증을 시작합니다."
echo "실행: pnpm --filter @tft-doubleup/web validate:ui"
pnpm --filter @tft-doubleup/web validate:ui
