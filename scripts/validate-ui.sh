#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "UI 검증은 1차 스캐폴딩 범위에서 아직 연결하지 않습니다."
echo "후속 UI mock-first 단계에서 apps/web 화면과 Playwright 기반 validate:ui를 연결하세요."
echo "현재 단계에서는 미연결 항목으로 기록하고 성공 처리합니다."
exit 0
