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

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js를 찾을 수 없어 workspace package manifest 확인과 JS/TS 검증을 건너뜁니다."
  echo "Node.js와 pnpm을 설치한 뒤 ./scripts/check.sh를 다시 실행하세요."
  exit 0
fi

required_workspace_packages=(
  "apps/web:@tft-doubleup/web"
  "apps/api:@tft-doubleup/api"
  "packages/domain:@tft-doubleup/domain"
  "packages/db:@tft-doubleup/db"
  "packages/config:@tft-doubleup/config"
)

for package_entry in "${required_workspace_packages[@]}"; do
  package_dir="${package_entry%%:*}"
  package_name="${package_entry#*:}"
  package_json="$package_dir/package.json"

  if [[ ! -f "$package_json" ]]; then
    echo "필수 workspace 패키지 package.json이 없습니다: $package_json"
    exit 1
  fi

  if ! node -e "const p=require('./$package_json'); process.exit(p.name === '$package_name' ? 0 : 1)" >/dev/null 2>&1; then
    echo "workspace 패키지 이름이 예상과 다릅니다: $package_json (expected: $package_name)"
    exit 1
  fi
done

echo "workspace 패키지 확인 완료: apps/web, apps/api, packages/domain, packages/db, packages/config"

for package_entry in "${required_workspace_packages[@]}"; do
  package_dir="${package_entry%%:*}"
  package_name="${package_entry#*:}"
  package_json="$package_dir/package.json"

  if ! node -e "const p=require('./$package_json'); process.exit(p.scripts && p.scripts.test ? 0 : 1)" >/dev/null 2>&1; then
    echo "$package_name package.json에 독립 실행 가능한 test 스크립트가 없습니다."
    echo "예: pnpm --filter $package_name test"
    exit 1
  fi
done

echo "workspace 테스트 스크립트 확인 완료: pnpm -r test 대상 패키지 전체"

if ! node -e "const p=require('./apps/api/package.json'); process.exit(p.scripts && p.scripts['test:health'] === 'vitest run test/health.test.ts' ? 0 : 1)" >/dev/null 2>&1; then
  echo "apps/api package.json에 health route만 독립 실행하는 test:health 스크립트가 없습니다."
  echo "예: pnpm --filter @tft-doubleup/api test:health"
  exit 1
fi

echo "API health route 독립 테스트 스크립트 확인 완료: pnpm --filter @tft-doubleup/api test:health"

api_health_test="apps/api/test/health.test.ts"
if [[ ! -f "$api_health_test" ]]; then
  echo "API health route 테스트 파일이 없습니다: $api_health_test"
  exit 1
fi

if ! grep -F 'import { app } from "../src/app.js";' "$api_health_test" >/dev/null; then
  echo "API health route 테스트가 Hono app 엔트리포인트를 직접 검증하지 않습니다: $api_health_test"
  exit 1
fi

if ! grep -F 'app.request("/health")' "$api_health_test" >/dev/null; then
  echo "API health route 테스트가 GET /health 요청을 포함하지 않습니다: $api_health_test"
  exit 1
fi

if ! grep -F 'status: "ok"' "$api_health_test" >/dev/null; then
  echo "API health route 테스트가 health 응답 status 계약을 확인하지 않습니다: $api_health_test"
  exit 1
fi

echo "API health route 테스트 파일 확인 완료: $api_health_test"

if ! node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.test && p.scripts.check && p.scripts.check.includes('pnpm test') ? 0 : 1)" >/dev/null 2>&1; then
  echo "root package.json에 workspace test 실행이 check 스크립트로 연결되어 있지 않습니다."
  echo "예: \"test\": \"pnpm -r test\", \"check\": \"pnpm lint && pnpm typecheck && pnpm test && pnpm build\""
  exit 1
fi

echo "root test/check 연결 확인 완료: pnpm test가 ./scripts/check.sh 경로에서 호출됩니다."

if ! node -e "const p=require('./apps/web/package.json'); process.exit(p.scripts && p.scripts.typecheck ? 0 : 1)" >/dev/null 2>&1; then
  echo "apps/web package.json에 독립 실행 가능한 typecheck 스크립트가 없습니다."
  echo "예: pnpm --filter @tft-doubleup/web typecheck"
  exit 1
fi

echo "frontend typecheck 스크립트 확인 완료: pnpm --filter @tft-doubleup/web typecheck"

if ! node -e "const p=require('./apps/web/package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)" >/dev/null 2>&1; then
  echo "apps/web package.json에 독립 실행 가능한 build 스크립트가 없습니다."
  echo "예: pnpm --filter @tft-doubleup/web build"
  exit 1
fi

echo "frontend build 스크립트 확인 완료: pnpm --filter @tft-doubleup/web build"

if ! node -e "const p=require('./apps/api/package.json'); process.exit(p.scripts && p.scripts.typecheck ? 0 : 1)" >/dev/null 2>&1; then
  echo "apps/api package.json에 독립 실행 가능한 typecheck 스크립트가 없습니다."
  echo "예: pnpm --filter @tft-doubleup/api typecheck"
  exit 1
fi

echo "backend typecheck 스크립트 확인 완료: pnpm --filter @tft-doubleup/api typecheck"

if ! node -e "const p=require('./apps/api/package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)" >/dev/null 2>&1; then
  echo "apps/api package.json에 독립 실행 가능한 build 스크립트가 없습니다."
  echo "예: pnpm --filter @tft-doubleup/api build"
  exit 1
fi

echo "backend build 스크립트 확인 완료: pnpm --filter @tft-doubleup/api build"

if ! node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.check ? 0 : 1)" >/dev/null 2>&1; then
  echo "package.json에 pnpm workspace 기본 검증용 check 스크립트가 없습니다."
  echo "예: pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  exit 1
fi

echo "root check 스크립트 확인 완료: pnpm run check"

if [[ ! -f pnpm-workspace.yaml ]]; then
  echo "pnpm-workspace.yaml이 없어 pnpm workspace 의존성 검증을 실행할 수 없습니다."
  exit 1
fi

if ! node -e "const p=require('./package.json'); process.exit(String(p.packageManager || '').startsWith('pnpm@') ? 0 : 1)" >/dev/null 2>&1; then
  echo "package.json의 packageManager가 pnpm으로 고정되어 있지 않습니다."
  echo "pnpm workspace 검증을 위해 packageManager를 pnpm@버전 형식으로 설정하세요."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  expected_pnpm_version="$(node -e "const p=require('./package.json'); console.log(String(p.packageManager || '').replace(/^pnpm@/, ''))")"
  echo "package.json이 pnpm workspace로 구성되어 있지만 pnpm을 찾을 수 없습니다."
  echo "스킵: pnpm workspace 의존성 설치 및 pnpm-lock.yaml 검증"
  echo "pnpm@${expected_pnpm_version} 설치 후 ./scripts/check.sh를 다시 실행하세요."
  exit 0
fi

PM="pnpm"

echo "pnpm workspace 의존성 설치 및 잠금파일 검증을 시작합니다."
if [[ -f pnpm-lock.yaml ]]; then
  echo "실행: pnpm install --frozen-lockfile"
  pnpm install --frozen-lockfile
else
  echo "pnpm-lock.yaml이 없어 frozen-lockfile 검증을 바로 실행할 수 없습니다."
  echo "실행: pnpm install --lockfile-only"
  pnpm install --lockfile-only
  echo "실행: pnpm install --frozen-lockfile"
  pnpm install --frozen-lockfile
fi

echo "pnpm workspace 기본 검증을 시작합니다."
echo "실행: $PM run check"
"$PM" run check

echo "API health route 테스트를 시작합니다."
echo "실행: $PM --filter @tft-doubleup/api test:health"
"$PM" --filter @tft-doubleup/api test:health
