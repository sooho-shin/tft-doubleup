# 0001. 초기 기술스택

## 상태

부분 채택

`0002-monorepo-api-database.md`에서 모노레포, API, 데이터베이스 선택을 구체화했다. 이 문서는 초기 후보와 재검토 조건을 남기고, 실제 구현 기준은 최신 결정 문서를 우선한다.

## 맥락

이 프로젝트는 TFT 더블업 팀원 매칭 서비스를 빠르게 구현해야 한다. 첫 화면은 실제 매칭 보드이며, MVP는 한국 서버(KR), 지금 가능 여부, 티어/목적/디스코드/플레이 스타일 필터, 모집글 신청 흐름에 집중한다.

초기에는 제품 검증 속도와 Codex 하네스 운영 편의성이 중요하다.

## 결정

초기 앱 스택은 아래를 기본 후보로 둔다.

- Runtime/package manager: Node.js, pnpm
- Frontend/fullstack: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI primitives: Radix UI 또는 shadcn/ui 계열 컴포넌트
- Forms: React Hook Form
- Validation: Zod
- Unit test: Vitest
- Browser test: Playwright
- Mocking: MSW
- Formatting/linting: ESLint, Prettier

백엔드는 MVP 초기에 아래 중 하나를 후보로 두었으나, 현재 구현 기준은 `0002-monorepo-api-database.md`를 따른다.

- 옵션 A: Next.js Route Handlers와 파일/메모리 mock 데이터로 시작
- 옵션 B: Supabase Postgres와 Row Level Security로 시작

현재 결정은 프론트와 API를 분리하고, Hono API와 PostgreSQL/Drizzle을 기준으로 시작하는 것이다. 실제 사용자 계정 단계에서는 Supabase Auth와 Supabase Postgres를 우선 검토한다.

## 이유

- Next.js는 매칭 보드, 상세 패널, 신청 흐름을 한 프로젝트 안에서 빠르게 만들기 좋다.
- TypeScript와 Zod는 도메인 모델과 API 입력값을 같은 기준으로 검증하기 좋다.
- Playwright는 UI 하네스와 잘 맞고, 모바일/데스크톱 화면 검증을 자동화하기 쉽다.
- Supabase는 인증, Postgres, 간단한 권한 정책을 빠르게 붙일 수 있다.

## 보류한 선택

- 별도 Express/Nest 백엔드: MVP 초기에는 운영 복잡도가 크다.
- 복잡한 추천 엔진: MVP 제외 범위다.
- Riot API 연동: MVP 제외 범위다.
- 예약/시간 조율 모델: MVP 제외 범위다.

## 앱 생성 후 필요한 명령

`package.json`에는 최소한 아래 스크립트를 둔다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "validate:ui": "pnpm build && playwright test",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

## 재검토 조건

- 사용자가 모바일 앱 우선 전략으로 바꾸는 경우
- 실시간 채팅이 MVP 핵심 기능으로 승격되는 경우
- Riot API 연동이 MVP 필수 조건이 되는 경우
- 백엔드를 별도 서비스로 배포해야 하는 명확한 운영 요구가 생기는 경우
