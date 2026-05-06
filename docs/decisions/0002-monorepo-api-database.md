# 0002. 모노레포, API, 데이터베이스 기준

## 상태

채택

## 맥락

TFT 더블업 팀원 매칭 서비스는 프론트엔드 화면 검증만으로 끝나지 않는다. 모집방 생성, 신청, 수락/거절, 연락처 노출 제한처럼 상태와 권한이 중요한 흐름이 MVP에 포함된다.

초기 구현은 빠르게 진행해야 하지만, 프론트엔드와 백엔드 책임을 분리하고 도메인 타입과 검증 스키마는 공유해야 한다.

## 결정

저장소는 `pnpm` workspace 기반 모노레포로 구성한다.

```text
apps/
  web/
  api/
packages/
  domain/
  db/
  config/
```

역할:

- `apps/web`: Next.js App Router 기반 프론트엔드
- `apps/api`: Hono 기반 API 서버
- `packages/domain`: 공통 TypeScript 타입, enum, Zod 스키마
- `packages/db`: Drizzle schema, migration, seed, query helper
- `packages/config`: 공통 TypeScript, ESLint, Prettier 설정

데이터베이스는 PostgreSQL을 기준으로 한다.

- 로컬 개발: Docker Postgres
- MVP 배포 후보: Supabase Postgres
- ORM/쿼리 계층: Drizzle

인증과 권한은 MVP 구현 시점에 아래 순서로 결정한다.

1. UI/흐름 검증 단계: mock session과 seed data
2. 실제 사용자 테스트 단계: Supabase Auth 우선 검토
3. 자체 인증이 필요한 명확한 이유가 있을 때만 별도 auth 구현

## 이유

- 프론트와 백엔드를 앱 단위로 분리하면서도 도메인 타입을 공유할 수 있다.
- Hono는 MVP API에 충분하고 NestJS보다 초기 비용이 낮다.
- PostgreSQL은 신청 상태, 방 상태, 연락처 접근 제한 같은 관계형 데이터를 명확하게 다루기 좋다.
- Drizzle은 TypeScript 코드와 SQL schema 사이의 추적성이 좋고, migration을 하네스에 연결하기 쉽다.
- Supabase는 MVP 이후 인증과 Postgres 운영을 빠르게 붙이기 좋다.

## 보류한 선택

- 단일 Next.js fullstack 앱: 빠르지만 API 책임과 백엔드 하네스가 흐려진다.
- NestJS: 구조는 좋지만 현재 MVP에는 과하다.
- Prisma: 생산성은 높지만 Drizzle보다 SQL/migration 가시성이 낮다.
- SQLite/file DB: 초기 mock에는 가능하지만 수락/연락처 보호 흐름의 운영 기준으로는 부족하다.
- Riot API 연동: MVP 제외.

## 구현 순서

1. `pnpm-workspace.yaml`과 루트 `package.json`을 만든다.
2. `packages/domain`에 enum, Zod schema, 타입을 먼저 만든다.
3. `packages/db`에 Drizzle schema와 seed를 만든다.
4. `apps/api`에 Hono 서버와 room/application/profile route를 만든다.
5. `apps/web`에 Next.js UI를 만들고 API client를 연결한다.
6. 로컬 Docker Postgres와 migration/seed/check 명령을 하네스에 연결한다.

## 재검토 조건

- 백엔드 없이 UI 프로토타입만 유지하기로 명확히 축소하는 경우
- 실시간 채팅이 MVP 필수로 승격되는 경우
- Supabase RLS를 직접 제품 권한 모델의 중심으로 쓰기로 결정하는 경우
- API를 별도 배포하지 않고 Next.js Route Handler로 합치기로 결정하는 경우
