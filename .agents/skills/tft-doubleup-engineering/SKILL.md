---
name: tft-doubleup-engineering
description: 이 저장소 안에서 TFT 더블업 팀원 매칭 서비스의 모노레포, 프론트엔드/백엔드 분리, PostgreSQL/Drizzle 데이터베이스, API, 하네스 스크립트, 테스트/검증 구조를 설계하거나 구현할 때 사용하는 프로젝트 전용 스킬.
---

# TFT 더블업 엔지니어링

## 목적

이 스킬은 제품 기획과 Figma 산출물을 실제 코드 구조로 옮길 때의 엔지니어링 기준을 정한다. 화면 기획은 `tft-doubleup-product`, Figma 작업은 `tft-doubleup-figma-design`, UI 검증은 `tft-doubleup-ui-validation`을 따른다. 이 스킬은 모노레포, API, DB, 하네스, 테스트 경계에 집중한다.

## 우선 문서

구현 전에 아래 문서를 먼저 확인한다.

- `docs/decisions/0002-monorepo-api-database.md`
- `docs/engineering/monorepo.md`
- `docs/engineering/database.md`
- `docs/engineering/harness-engineering.md`
- `docs/domain.md`
- `docs/product/mvp.md`
- `docs/product/screens.md`
- `docs/product/ux-copy.md`

`docs/`와 스킬 내용이 충돌하면 `docs/`를 우선한다.

## 기본 구조

모노레포 기준:

```text
apps/
  web/
  api/
packages/
  domain/
  db/
  config/
```

기술 기준:

- package manager: `pnpm`
- web: Next.js App Router, TypeScript, Tailwind CSS
- api: Hono, TypeScript
- domain: Zod schema, TypeScript type, label map
- db: PostgreSQL, Drizzle
- test: Vitest, Playwright

## 구현 순서

1. `packages/domain`을 먼저 만든다.
   - enum, Zod schema, 타입, 한국어 라벨 매핑
   - MVP 제외 필드는 넣지 않는다.

2. `packages/db`를 만든다.
   - Drizzle schema, migration, seed
   - `docs/engineering/database.md`의 테이블과 규칙을 따른다.

3. `apps/api`를 만든다.
   - Hono route
   - 입력값은 `packages/domain` schema로 검증
   - DB 접근은 `packages/db` helper를 통해 수행

4. `apps/web`을 만든다.
   - 첫 화면은 매칭 보드
   - Figma `05 Pages`의 로비 화면을 구현 기준으로 사용
   - API가 없거나 미완성인 구간은 명시적인 mock adapter를 둔다.

5. 하네스 명령을 연결한다.
   - 루트 `check`
   - 루트 `validate:ui`
   - `scripts/check.sh`
   - `scripts/validate-ui.sh`
   - `scripts/qa.sh`

## 금지

MVP에서는 아래를 구현하지 않는다.

- 다중 서버 선택
- 예약 모집
- 미래 시간대 기반 모집
- 시간 조율 기능
- Riot API 기반 티어 동기화
- 실제 파트너 추천 점수
- 실제 파트너 추천 화면
- 실제 랭킹 화면
- 실제 가이드 콘텐츠
- 서비스 내 채팅

DB schema, API response, mock seed, UI 라벨에도 위 항목을 넣지 않는다.

## 하네스 기준

코드나 설정 변경 후 가능한 경우 실행한다.

```bash
./scripts/check.sh
```

UI 변경이 포함되면 실행한다.

```bash
./scripts/validate-ui.sh
```

검증이 스킵되면 스킵된 이유를 최종 보고에 적는다.

## 응답 방식

엔지니어링 작업을 시작할 때는 어떤 계층을 바꾸는지 먼저 말한다.

- domain
- db
- api
- web
- harness
- docs

최종 보고에는 수정한 계층, 실행한 검증, 남은 리스크를 짧게 포함한다.
