# TFT Double Up

TFT 더블업 유저가 한국 서버(KR)에서 지금 바로 같이 플레이할 파트너를 찾기 위한 팀원 매칭 서비스입니다. MVP는 큰 마케팅 페이지보다 실제 사용 흐름을 우선하며, 모집방 목록, 필터, 방 만들기, 신청/수락/거절 흐름을 중심으로 설계합니다.

현재 저장소는 프론트엔드와 백엔드를 분리한 pnpm 모노레포입니다. 도메인 값과 검증 규칙은 `packages/domain`에서 공유하고, PostgreSQL/Drizzle 기반 데이터 계층은 `packages/db`에 둡니다.

## 현재 구현 상태

현재는 1차 풀스택 스캐폴딩 단계입니다.

- `apps/web`: Next.js App Router 기반 웹 앱
- `apps/api`: Hono 기반 API 서버, `GET /health` 제공
- `packages/domain`: Zod schema, TypeScript 타입, 한국어 라벨
- `packages/db`: Drizzle schema, DB client, seed entry
- `packages/config`: 공용 TypeScript/ESLint 설정
- `scripts/check.sh`: 문서, workspace, lint, typecheck, test, build 검증
- `scripts/validate-ui.sh`: UI 검증 placeholder
- `scripts/validate-db.sh`: DB 통합 검증 placeholder

아직 실제 DB migration 실행, Docker Postgres 기동, Playwright UI 검증은 연결되어 있지 않습니다. 해당 항목은 후속 구현 단계에서 붙입니다.

## 기술 스택

- Package manager: `pnpm@10.11.0`
- Runtime: Node.js
- Frontend: Next.js 15, React 19, TypeScript
- Backend: Hono, `@hono/node-server`, TypeScript
- Domain validation: Zod
- Database: PostgreSQL, Drizzle ORM, Drizzle Kit
- Test: Vitest
- Monorepo: pnpm workspace

## 디렉터리 구조

```text
tft-doubleup/
  apps/
    web/                 # Next.js 웹 앱
    api/                 # Hono API 서버
  packages/
    domain/              # 도메인 값, Zod schema, 타입, 라벨
    db/                  # Drizzle schema, DB client, seed
    config/              # 공용 tsconfig, ESLint 설정
  docs/                  # 제품/도메인/엔지니어링 source of truth
  scripts/               # 사람이 직접 실행하는 검증 하네스
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
```

## 사전 준비

Node.js와 Corepack이 필요합니다. 이 저장소는 `package.json`의 `packageManager`로 `pnpm@10.11.0`을 고정합니다.

```bash
node --version
corepack --version
corepack enable
corepack prepare pnpm@10.11.0 --activate
pnpm --version
```

권장 Node.js 버전은 22 이상입니다. 현재 개발 환경에서는 Node.js 23에서도 검증되었습니다.

## 설치

의존성을 설치합니다.

```bash
pnpm install --frozen-lockfile
```

처음 설치하는 환경에서 `pnpm` 명령을 찾지 못하면 Corepack으로 실행할 수 있습니다.

```bash
corepack pnpm install --frozen-lockfile
```

`pnpm install` 중 `Ignored build scripts: esbuild, sharp` 경고가 보일 수 있습니다. 현재 스캐폴딩 단계의 기본 검증은 이 경고가 있어도 통과합니다. 의존성 빌드 스크립트 승인 정책을 엄격히 운영할 때는 별도로 `pnpm approve-builds`를 검토합니다.

## 환경 변수

예시 파일을 복사해서 로컬 환경 파일을 만듭니다.

```bash
cp .env.example .env
```

현재 주요 값은 아래와 같습니다.

```bash
NODE_ENV=development
PORT=4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tft_doubleup
```

현재 API 서버는 `PORT`를 읽고, 값이 없으면 기본값 `4000`으로 실행됩니다. `DATABASE_URL`은 Drizzle/PostgreSQL 연결을 위한 값이지만, 1차 스캐폴딩에서는 실제 migration 실행 검증까지 연결하지 않았습니다.

## 개발 서버 실행

프론트엔드와 API를 동시에 실행합니다.

```bash
pnpm dev
```

기본 주소:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- API health check: `http://localhost:4000/health`

개별 실행도 가능합니다.

```bash
pnpm --filter @tft-doubleup/web dev
pnpm --filter @tft-doubleup/api dev
```

API 포트를 바꾸려면 `PORT`를 지정합니다.

```bash
PORT=4100 pnpm --filter @tft-doubleup/api dev
```

웹 앱이 바라보는 API 주소를 바꾸려면 `NEXT_PUBLIC_API_BASE_URL`을 함께 맞춥니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4100 pnpm --filter @tft-doubleup/web dev
```

## 검증 명령

전체 기본 검증은 아래 명령을 사용합니다.

```bash
./scripts/check.sh
```

이 명령은 다음을 확인합니다.

- 문서 하네스
- 필수 workspace 패키지 존재 여부
- 각 패키지의 test/build/typecheck script
- pnpm lockfile 기반 설치 검증
- lint
- typecheck
- unit/smoke test
- production build
- API health route 독립 테스트

루트 pnpm script로도 실행할 수 있습니다.

```bash
pnpm check
```

개별 검증:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @tft-doubleup/api test:health
```

릴리즈 전 전체 하네스는 아래 명령을 기준으로 합니다.

```bash
./scripts/qa.sh
```

`qa.sh`는 `check.sh`, `validate-ui.sh`, `validate-db.sh`를 순서대로 실행합니다.

## UI 검증

현재 UI 검증 스크립트는 아직 Playwright와 연결되어 있지 않습니다.

```bash
./scripts/validate-ui.sh
```

현재 동작:

- 후속 UI mock-first 단계에서 연결할 항목을 안내합니다.
- 1차 스캐폴딩 완료 기준에서는 성공 코드로 종료합니다.

후속 단계에서 연결할 항목:

- `apps/web` 화면 기준 Playwright 실행
- 데스크톱/모바일 스크린샷 검증
- 텍스트 겹침, 레이아웃 깨짐, 과도한 여백 확인
- Figma 기준 화면과 구현 UI 비교

## 데이터베이스

DB 기준은 PostgreSQL과 Drizzle입니다. 관련 코드는 `packages/db`에 있습니다.

```bash
packages/db/
  drizzle.config.ts
  src/client.ts
  src/schema.ts
  src/seed.ts
```

현재 제공되는 DB 관련 명령:

```bash
pnpm --filter @tft-doubleup/db db:generate
pnpm db:migrate
pnpm db:seed
./scripts/validate-db.sh
```

주의할 점:

- `db:generate`는 Drizzle migration 파일 생성을 위한 명령입니다.
- `db:migrate`는 현재 1차 스캐폴딩에서 실제 migration 실행을 보류한다는 메시지를 출력합니다.
- `db:seed`는 seed entry를 실행하지만, 실제 DB 연결 검증은 아직 하네스에 묶지 않았습니다.
- `validate-db.sh`는 Docker Postgres, migration, seed, API 통합 테스트가 아직 미연결임을 안내하고 성공 처리합니다.

후속 단계에서 연결할 항목:

- Docker Postgres 또는 CI service container
- `DATABASE_URL` 기반 migration 실행
- seed 실행 검증
- DB가 필요한 API 통합 테스트

## 패키지별 역할

### `apps/web`

사용자가 보는 매칭 보드 UI입니다. 현재 루트 화면(`/`)은 더블업 팀원찾기 보드의 초기 UI를 제공합니다.

주요 명령:

```bash
pnpm --filter @tft-doubleup/web dev
pnpm --filter @tft-doubleup/web build
pnpm --filter @tft-doubleup/web test
pnpm --filter @tft-doubleup/web typecheck
```

### `apps/api`

Hono 기반 API 서버입니다. 현재는 health route를 제공합니다.

```bash
curl http://localhost:4000/health
```

예상 응답:

```json
{
  "defaultServer": "KR",
  "status": "ok",
  "service": "tft-doubleup-api"
}
```

주요 명령:

```bash
pnpm --filter @tft-doubleup/api dev
pnpm --filter @tft-doubleup/api build
pnpm --filter @tft-doubleup/api test
pnpm --filter @tft-doubleup/api test:health
```

### `packages/domain`

서비스의 도메인 source of truth입니다.

포함 항목:

- 서버 값: MVP에서는 `KR`
- 디스코드 방식
- 플레이 목적
- 플레이 스타일 태그
- 지금 가능 상태
- 모집 상태
- 신청 상태
- 성별 공개값
- Zod schema
- TypeScript type
- 한국어 라벨

주요 명령:

```bash
pnpm --filter @tft-doubleup/domain build
pnpm --filter @tft-doubleup/domain test
```

### `packages/db`

PostgreSQL/Drizzle 데이터 계층입니다.

주요 테이블:

- `users`
- `profiles`
- `rooms`
- `room_applications`

주요 명령:

```bash
pnpm --filter @tft-doubleup/db build
pnpm --filter @tft-doubleup/db test
pnpm --filter @tft-doubleup/db db:generate
```

### `packages/config`

공용 TypeScript/ESLint 설정 패키지입니다. 초기 단계에서는 설정 파일 중심으로만 유지하고, 실제 중복이 생길 때만 확장합니다.

주요 명령:

```bash
pnpm --filter @tft-doubleup/config test
pnpm --filter @tft-doubleup/config lint
```

## 개발 원칙

제품 source of truth는 `docs/` 아래 문서입니다. 구현 전에 관련 문서를 먼저 확인합니다.

- MVP 범위: `docs/product/mvp.md`
- 화면 구성: `docs/product/screens.md`
- UX 문구: `docs/product/ux-copy.md`
- 디자인 방향: `docs/product/design-direction.md`
- 도메인 모델: `docs/domain.md`
- 모노레포 기준: `docs/engineering/monorepo.md`
- DB 기준: `docs/engineering/database.md`
- 하네스 기준: `docs/engineering/harness-engineering.md`

MVP에서 제외하는 기능은 코드, DB schema, mock data, UI 라벨에도 넣지 않습니다.

제외 항목:

- 다중 서버 지원
- 예약 모집
- 미래 시간대 기반 모집
- 시간 조율
- Riot API 기반 티어 동기화
- 실제 파트너 추천 점수
- 실제 파트너 추천 화면
- 실제 랭킹 화면
- 서비스 내 채팅

## 문제 해결

### `pnpm`을 찾을 수 없는 경우

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

그래도 안 되면 Corepack을 통해 직접 실행합니다.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm check
```

### API 포트가 이미 사용 중인 경우

```bash
PORT=4100 pnpm --filter @tft-doubleup/api dev
```

웹에서 바뀐 API 포트를 바라보려면 아래처럼 실행합니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4100 pnpm --filter @tft-doubleup/web dev
```

### DB 검증이 실제 DB를 띄우지 않는 경우

정상입니다. 현재 1차 스캐폴딩에서는 `validate-db.sh`가 미연결 상태를 안내하고 성공 종료합니다. 실제 Docker Postgres, migration, seed 검증은 후속 단계에서 연결합니다.

### UI 검증이 실제 브라우저를 띄우지 않는 경우

정상입니다. 현재 1차 스캐폴딩에서는 `validate-ui.sh`가 미연결 상태를 안내하고 성공 종료합니다. 실제 Playwright 검증은 후속 UI 구현 단계에서 연결합니다.
