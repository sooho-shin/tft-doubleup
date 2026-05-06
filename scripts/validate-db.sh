#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "DB 통합 검증은 아직 연결되지 않았습니다."
echo "1차 스캐폴딩 완료 기준에서는 Docker Postgres 기동과 Drizzle migration 검증을 실행하지 않습니다."
echo "후속 단계에서 아래 항목을 연결하세요:"
echo "- Docker Postgres 또는 CI service container"
echo "- DATABASE_URL 환경 변수"
echo "- packages/db Drizzle migration 검증"
echo "- packages/db seed 실행 검증"
echo "- DB가 필요한 API 통합 테스트"

exit 0
