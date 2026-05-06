# 모노레포 구현 기준

## 목표

프론트엔드와 백엔드를 분리하되, 도메인 타입과 검증 규칙은 하나의 source of truth로 공유한다. 구현 속도를 위해 구조는 단순하게 시작하고, 하네스 명령으로 품질을 반복 확인한다.

## 기본 구조

```text
apps/
  web/
  api/
packages/
  domain/
  db/
  config/
```

## 루트

루트는 workspace와 공통 명령을 담당한다.

필수 파일:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `.env.example`

루트 스크립트 기준:

```json
{
  "scripts": {
    "dev": "pnpm --parallel --filter @tft-doubleup/api --filter @tft-doubleup/web dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build",
    "validate:ui": "pnpm --filter @tft-doubleup/web validate:ui",
    "db:migrate": "pnpm --filter @tft-doubleup/db db:migrate",
    "db:seed": "pnpm --filter @tft-doubleup/db db:seed"
  }
}
```

## apps/web

역할:

- 사용자가 보는 매칭 보드와 폼을 구현한다.
- API 응답을 표시하고, 클라이언트 필터/상태를 관리한다.
- 도메인 타입과 Zod schema는 `packages/domain`에서 가져온다.

기술 기준:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod resolver
- Playwright UI 검증

주요 라우트:

- `/`: 더블업 팀원찾기 보드
- `/rooms/[id]`: 방 상세
- `/rooms/new`: 방 만들기
- `/profile`: 내 더블업 프로필

MVP에서 만들지 않는 것:

- 파트너 추천 화면
- 랭킹 화면
- 실제 가이드 콘텐츠
- 다중 서버 선택 UI
- 예약/시간 조율 UI

## apps/api

역할:

- 모집방, 신청, 프로필 API를 제공한다.
- 입력값은 `packages/domain`의 Zod schema로 검증한다.
- DB 접근은 `packages/db`를 통해 수행한다.

기술 기준:

- Hono
- TypeScript
- Zod validation
- Vitest route/service test

초기 route:

```text
GET    /health
GET    /rooms
POST   /rooms
GET    /rooms/:id
POST   /rooms/:id/applications
GET    /me/profile
PUT    /me/profile
GET    /me/applications
PATCH  /applications/:id
```

## packages/domain

역할:

- enum 후보와 API 값 정의
- Zod schema
- TypeScript 타입
- UI 라벨 매핑

규칙:

- MVP 제외 필드는 schema에 넣지 않는다.
- 서버는 `KR`만 허용한다.
- 성별은 본인 정보로만 정의하고 필터/추천 schema에 넣지 않는다.
- UI 라벨은 한국어 문구와 API 값을 분리한다.

## packages/db

역할:

- Drizzle schema
- migration
- seed data
- query helper

규칙:

- schema는 `docs/engineering/database.md`를 따른다.
- seed data는 UI 검증에 필요한 상태를 모두 포함한다.
- migration은 사람이 읽을 수 있어야 한다.

## packages/config

역할:

- 공통 TypeScript 설정
- ESLint/Prettier 설정
- 테스트 설정 공유

초기에는 과한 추상화를 만들지 않는다. 실제 중복이 생기면 공통화한다.
