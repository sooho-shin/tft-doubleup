#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f package.json ]]; then
  echo "package.json이 아직 없어 UI 검증을 건너뜁니다."
  echo "프론트엔드 앱 생성 후 validate:ui 또는 playwright 테스트를 연결하세요."
  exit 0
fi

if command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
elif command -v npm >/dev/null 2>&1; then
  PM="npm"
else
  echo "pnpm 또는 npm을 찾을 수 없습니다."
  exit 1
fi

has_script() {
  local script_name="$1"
  node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$script_name'] ? 0 : 1)" >/dev/null 2>&1
}

if has_script validate:ui; then
  echo "실행: $PM run validate:ui"
  "$PM" run validate:ui
elif has_script test:e2e; then
  echo "실행: $PM run test:e2e"
  "$PM" run test:e2e
elif [[ -d tests/e2e || -f playwright.config.ts || -f playwright.config.js ]]; then
  echo "실행: $PM exec playwright test"
  "$PM" exec playwright test
else
  echo "UI 검증 명령이 아직 없습니다."
  echo "권장: package.json에 validate:ui 또는 test:e2e를 추가하고 Playwright를 연결하세요."
fi
