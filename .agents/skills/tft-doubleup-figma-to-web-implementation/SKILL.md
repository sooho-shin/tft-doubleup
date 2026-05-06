---
name: tft-doubleup-figma-to-web-implementation
description: 이 저장소 안에서 기준 Figma 파일의 TFT 더블업 화면을 Next.js apps/web 구현으로 옮기고, 임시 smoke UI가 아니라 Figma 기준 UI와 Playwright 하네스 통과까지 완료해야 할 때 사용하는 프로젝트 전용 스킬.
---

# TFT 더블업 Figma-to-Web 구현

## 목적

이 스킬은 기준 Figma 디자인을 실제 `apps/web` 구현으로 옮길 때 사용한다. 목표는 빌드가 되는 임시 화면이 아니라, Figma의 `05 Pages` 최종 프레임을 구현 기준으로 삼고 브라우저 검증까지 통과하는 것이다.

## 함께 사용할 스킬

- 제품 범위와 문구 확인: `tft-doubleup-product`
- 기준 Figma 파일/프레임 확인: `tft-doubleup-figma-design`
- 구현 UI 품질 검증: `tft-doubleup-ui-validation`
- 모노레포/하네스 구조 변경: `tft-doubleup-engineering`

`docs/`와 스킬 내용이 충돌하면 `docs/`를 우선한다.

## 시작 전 확인

구현 전에 반드시 확인한다.

- `docs/product/mvp.md`
- `docs/product/screens.md`
- `docs/product/ux-copy.md`
- `docs/product/design-direction.md`
- `docs/domain.md`
- `.agents/skills/tft-doubleup-figma-design/references/figma-file-link.md`
- `apps/web/src/app`
- `scripts/validate-ui.sh`
- `apps/web/e2e`

## 구현 순서

1. 기준 Figma 파일을 확인한다.
   - 파일 링크가 없으면 구현을 시작하지 말고 사용자에게 보고한다.
   - `05 Pages`의 최종 구현 대상 프레임을 확인한다.
   - 최소 기준은 `Page/Desktop Matching Board`, `Page/Desktop Recruitment Detail`, `Page/Mobile Matching Board`다.

2. Figma 화면을 구현 명세로 요약한다.
   - 색상, 배경, 패널 톤
   - 레이아웃 grid/flex 구조
   - 네비게이션, 필터, 모집 카드, 우측 패널, 모바일 액션
   - 타이포그래피 크기와 정보 위계
   - 반복 카드 수와 상태값

3. `apps/web` 구현을 수정한다.
   - 임시 smoke UI를 최종 화면 구현으로 교체한다.
   - 주요 레이아웃은 React 컴포넌트와 CSS grid/flex로 구성한다.
   - mock data는 `packages/domain`의 값과 라벨 정책에 맞춘다.
   - 테스트와 검증이 잡을 수 있도록 주요 요소에는 안정적인 접근 수단을 둔다.
     - accessible role/name 우선
     - 필요한 경우 `data-testid`

4. MVP 제외 항목을 넣지 않는다.
   - 다중 서버
   - 예약 모집
   - 미래 시간대
   - 시간 조율
   - Riot API 동기화
   - 실제 파트너 추천 점수/화면
   - 실제 랭킹 화면
   - 서비스 내 채팅

5. 검증한다.
   - `./scripts/check.sh`
   - `./scripts/validate-ui.sh`

6. 실패하면 수정 후 처음부터 다시 검증한다.
   - Playwright 실패를 스킵하거나 완화하지 않는다.
   - 테스트 기대값이 틀린 것이 명확한 경우에만 하네스를 수정한다.
   - 단순히 통과시키기 위해 dark tone, 카드 수, overflow 검증을 제거하지 않는다.

## 완료 조건

아래를 모두 만족해야 완료 보고한다.

- 구현 대상 Figma 프레임을 확인했다.
- `apps/web` 첫 화면이 Figma 방향의 다크 정보형 UI로 구현됐다.
- 현재처럼 밝은 placeholder/smoke UI가 남아 있지 않다.
- 데스크톱과 모바일에서 horizontal overflow가 없다.
- 모집 카드, 필터, 우측 패널, 주요 버튼이 브라우저에서 확인된다.
- `./scripts/check.sh`가 통과한다.
- `./scripts/validate-ui.sh`가 통과한다.

## 중단 조건

다음 경우에는 구현 완료라고 말하지 않는다.

- Figma 파일을 읽지 못했다.
- 구현 대상 프레임을 확인하지 못했다.
- `validate-ui.sh`가 실패한다.
- Playwright 브라우저가 설치되지 않아 검증하지 못했다.
- 현재 구현이 Figma와 명백히 다르지만 `check.sh`만 통과했다.
