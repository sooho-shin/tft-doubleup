# 개발 하네스 운영 방식

이 문서는 앱 구현 전에 Codex와 사람이 공유할 기준점을 정리한다. 하네스의 목적은 구현 방향을 매번 다시 정하지 않고, 제품 범위와 검증 명령을 일관되게 유지하는 것이다.

## 하네스 구성

- `AGENTS.md`: Codex가 저장소 전체에서 따라야 할 작업 규칙
- `docs/product/mvp.md`: MVP 범위와 사용자 흐름
- `docs/product/screens.md`: 화면 목록과 화면별 필수 상태
- `docs/product/ux-copy.md`: 한국어 UX 문구와 금지 문구
- `docs/product/design-direction.md`: 시각 방향과 핵심 컴포넌트
- `docs/domain.md`: 핵심 도메인 모델과 상태값
- `docs/decisions/0001-tech-stack.md`: 초기 기술스택 결정
- `scripts/check.sh`: 코드 변경 후 기본 검증
- `scripts/validate-ui.sh`: UI 변경 후 브라우저/화면 검증
- `scripts/qa.sh`: 배포 전 통합 점검

## 작업 순서

1. 제품 범위가 바뀌면 `docs/product/mvp.md`를 먼저 갱신한다.
2. 화면 구성이 바뀌면 `docs/product/screens.md`를 갱신한다.
3. 라벨, 상태 문구, 버튼 문구가 바뀌면 `docs/product/ux-copy.md`를 갱신한다.
4. 시각 방향이나 컴포넌트 기준이 바뀌면 `docs/product/design-direction.md`를 갱신한다.
5. 데이터 필드나 상태값이 바뀌면 `docs/domain.md`를 같이 갱신한다.
6. 기술스택이나 아키텍처 선택이 바뀌면 `docs/decisions/`에 결정 문서를 추가한다.
7. 구현 후에는 `./scripts/check.sh`를 실행한다.
8. UI 변경이 있으면 `./scripts/validate-ui.sh`를 실행한다.
9. 릴리즈 전에는 `./scripts/qa.sh`를 실행한다.

## 앱 생성 전 기준

- 첫 화면은 랜딩페이지가 아니라 실제 더블업 팀원찾기 보드다.
- MVP는 한국 서버(KR)와 지금 가능한 모집글 중심이다.
- 예약 모집, 다중 서버, Riot API 연동, 추천 점수, 랭킹, 가이드는 MVP에서 제외한다.
- `파트너 추천`, `랭킹`, `가이드`는 네비게이션에 둘 수 있지만 실제 화면은 준비중 상태로 처리한다.

## 앱 생성 후 연결할 명령

`package.json`에 아래 명령을 연결하면 기존 scripts가 자동으로 사용한다.

```json
{
  "scripts": {
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "validate:ui": "pnpm build && playwright test"
  }
}
```

## 변경 원칙

- 제품 기획의 source of truth는 `docs/`다.
- `.agents/skills/`는 Codex의 작업 방식과 판단 기준을 정하는 지침이다.
- `docs/`와 `.agents/skills/`의 내용이 충돌하면 `docs/`를 우선한다.
- 문서와 구현이 충돌하면 문서를 먼저 갱신하거나, 구현을 문서에 맞춘다.
- MVP 제외 항목을 구현하려면 먼저 `docs/product/mvp.md`에서 범위를 수정한다.
- 스크립트는 사람이 직접 실행해도 이해되는 출력 메시지를 남긴다.
