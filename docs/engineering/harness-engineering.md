# 하네스 엔지니어링 기준

## 목적

하네스는 Codex와 사람이 같은 버튼으로 품질을 확인하게 만드는 운영 계층이다. 모노레포 전환 후에도 `scripts/` 아래 명령은 안정적인 진입점으로 유지한다.

## 스크립트 계약

모든 스크립트는 아래 규칙을 따른다.

- `set -euo pipefail` 사용
- 저장소 루트로 이동 후 실행
- 필요한 도구가 없으면 명확한 메시지 출력
- 실패 시 즉시 중단
- 앱이 아직 없으면 스킵 사유를 설명하고 종료

## 기본 명령

### scripts/check.sh

목적:

- 문서 하네스 확인
- 코드 lint/typecheck/test/build 실행

모노레포 생성 후 기대 동작:

```text
./scripts/validate-docs.sh
pnpm run check
```

### scripts/validate-ui.sh

목적:

- UI 변경 후 데스크톱/모바일 화면 검증

모노레포 생성 후 기대 동작:

```text
pnpm run validate:ui
```

`apps/web`의 Playwright 검증은 최소 아래를 확인한다.

- 데스크톱 매칭 보드가 첫 화면에 표시됨
- 모바일 매칭 보드에서 하단 액션바가 viewport 안에 있음
- 모집 카드 텍스트가 겹치지 않음
- MVP 제외 문구가 노출되지 않음
- 필터 적용/초기화가 동작함

### scripts/qa.sh

목적:

- 릴리즈 전 통합 점검

기대 동작:

```text
./scripts/check.sh
./scripts/validate-ui.sh
```

## 문서 검증

`scripts/validate-docs.sh`는 아래 문서를 필수로 확인한다.

- `docs/product/*`
- `docs/domain.md`
- `docs/decisions/*`
- `docs/engineering/monorepo.md`
- `docs/engineering/database.md`
- `docs/engineering/harness-engineering.md`

## 테스트 계층

### domain test

위치:

- `packages/domain`

확인:

- enum 값
- Zod schema
- 라벨 매핑
- MVP 제외 필드 부재

### db test

위치:

- `packages/db`

확인:

- migration 생성
- seed 실행
- 주요 query helper
- 신청 중복 제한

### api test

위치:

- `apps/api`

확인:

- route 입력 검증
- room 목록/상세
- room 생성
- 신청 생성
- 신청 수락/거절 권한
- 수락 전 연락처 비노출

### web test

위치:

- `apps/web`

확인:

- 매칭 보드 필터
- 방 상세
- 방 만들기 폼
- 신청 폼
- 준비중 상태
- 데스크톱/모바일 반응형

## CI 기준

초기 CI는 아래 순서만 둔다.

```text
pnpm install --frozen-lockfile
pnpm run check
pnpm run validate:ui
```

DB가 필요한 테스트는 로컬 Docker 또는 CI service container가 준비된 뒤 활성화한다. 준비 전에는 DB 통합 테스트를 unit test처럼 위장하지 않는다.
