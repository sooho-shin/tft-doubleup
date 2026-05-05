#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

"$ROOT_DIR/scripts/validate-docs.sh"

if [[ ! -f package.json ]]; then
  echo "package.json이 아직 없어 JS/TS 검증을 건너뜁니다."
  echo "앱 스캐폴딩 후 package.json에 check/lint/typecheck/test/build 스크립트를 추가하세요."
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

run_if_present() {
  local script_name="$1"

  if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$script_name'] ? 0 : 1)" >/dev/null 2>&1; then
    echo "실행: $PM run $script_name"
    "$PM" run "$script_name"
  else
    echo "건너뜀: package.json에 $script_name 스크립트가 없습니다."
  fi
}

if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.check ? 0 : 1)" >/dev/null 2>&1; then
  echo "실행: $PM run check"
  "$PM" run check
else
  run_if_present lint
  run_if_present typecheck
  run_if_present test
  run_if_present build
fi
