#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

required_files=(
  "AGENTS.md"
  "docs/harness.md"
  "docs/product/mvp.md"
  "docs/product/screens.md"
  "docs/product/ux-copy.md"
  "docs/product/design-direction.md"
  "docs/domain.md"
  "docs/decisions/0001-tech-stack.md"
  "docs/decisions/0002-monorepo-api-database.md"
  "docs/engineering/monorepo.md"
  "docs/engineering/database.md"
  "docs/engineering/harness-engineering.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -s "$file" ]]; then
    echo "필수 하네스 문서가 없거나 비어 있습니다: $file"
    exit 1
  fi
done

echo "문서 하네스 확인 완료"
