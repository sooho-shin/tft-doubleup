---
name: tft-doubleup-design-workflow
description: 이 저장소 안에서 TFT 더블업 팀원 매칭 서비스의 기획 수정, docs source of truth 갱신, 기준 Figma 파일 제작/수정, UI 품질 검증과 재수정 반복을 한 번에 수행할 때 사용하는 상위 workflow 스킬. 사용자가 기획 변경과 Figma 디자인 반영, 디자인 QA, 반복 검수, 최종 통과까지 요청하면 이 스킬을 사용한다.
---

# TFT 더블업 기획-디자인-검증 워크플로우

## 목적

이 스킬은 기존 세 스킬을 합치지 않고 순서대로 사용하는 상위 오케스트레이션 지침이다.

- `tft-doubleup-product`: 무엇을 바꿀지 정하고 `docs/` 기획 원본을 갱신한다.
- `tft-doubleup-figma-design`: 갱신된 기획을 기준 Figma 파일에 반영한다.
- `tft-doubleup-ui-validation`: Figma UI를 검증하고 실패하면 수정과 재검증을 반복한다.

개별 스킬은 그대로 유지한다. 이 스킬은 “기획 수정부터 Figma 완료 검증까지 한 번에 해줘” 같은 요청에서 전체 순서와 완료 조건을 고정한다.

## 기본 원칙

- 기획의 source of truth는 `docs/`다.
- `.agents/skills/`는 Codex의 작업 방식과 판단 기준이다.
- `docs/`와 스킬 reference가 충돌하면 `docs/`를 우선한다.
- Figma 기준 파일은 사용자가 다른 링크를 주지 않는 한 `tft-doubleup-figma-design/references/figma-file-link.md`의 파일을 사용한다.
- 디자인 완료는 화면을 만든 시점이 아니라 `tft-doubleup-ui-validation` 기준을 통과한 시점이다.
- 검증 실패 시 실패 항목만 보는 것이 아니라 전체 검증 루프를 다시 돈다.

## 작업 시작

작업을 시작할 때 사용 스킬을 명시한다.

```text
`tft-doubleup-product`로 기획 docs를 수정하고,
`tft-doubleup-figma-design`로 기준 Figma 파일에 반영한 뒤,
`tft-doubleup-ui-validation`로 통과할 때까지 검증하겠습니다.
```

요구사항이 모호하면 먼저 다음을 확정한다.

- 변경할 제품 범위
- 영향을 받는 화면
- 바뀌는 UX 문구나 상태값
- Figma에서 수정할 페이지/프레임
- MVP 포함/제외 정책의 변경 여부

## 1단계: 기획 수정

`tft-doubleup-product`를 따른다.

작업 성격별 수정 위치:

- MVP 범위/기능 우선순위: `docs/product/mvp.md`
- 화면 구성/화면별 상태: `docs/product/screens.md`
- UX 문구/라벨/버튼: `docs/product/ux-copy.md`
- 디자인 방향/컴포넌트 기준: `docs/product/design-direction.md`
- 데이터 모델/상태값: `docs/domain.md`
- 기술스택/아키텍처 결정: `docs/decisions/*.md`

기획 수정 후 반드시 확인한다.

- MVP 제외 항목이 실수로 포함되지 않았는가
- 화면 명세와 UX 문구가 서로 충돌하지 않는가
- 도메인 상태값과 화면 상태가 맞는가
- Figma에 반영할 변경 범위가 명확한가

문서 수정 후 `./scripts/check.sh`를 실행한다.

## 2단계: Figma 반영

`tft-doubleup-figma-design`를 따른다.

작업 기준:

- 기준 Figma 파일을 우선 사용한다.
- 새 파일은 사용자가 명시하거나 작업상 꼭 필요할 때만 만든다.
- Figma 반영은 기본적으로 Codex가 직접 `use_figma`를 순차 호출해 수행한다.
- `ooo ralph`, Ouroboros evolve, 병렬 하위 세션으로 같은 Figma 파일을 자동 수정/검증하는 방식은 사용자가 명시적으로 요청하지 않는 한 사용하지 않는다.
- 각 Figma 수정 단계 후에는 read-only `use_figma`로 파일/페이지/프레임 상태를 확인하고 다음 단계로 넘어간다.
- `00 Foundation`, `01 Atoms`, `02 Molecules`, `03 Organisms`, `04 Templates`, `05 Pages`, `99 Notes` 구조를 유지한다.
- 최종 화면은 최소 `Page/Desktop Matching Board`, `Page/Desktop Recruitment Detail`, `Page/Mobile Matching Board`를 기준으로 검토한다.
- Figma-native 프레임, 오토레이아웃, Atomic Design 구조를 우선한다.
- 주요 레이아웃을 좌표 기반으로 만들지 않는다.
- lolchess.gg는 다크 정보형 톤앤매너 참고용으로만 쓰고 고유 자산과 레이아웃을 복제하지 않는다.

Figma 반영 전 확인한다.

- 변경된 `docs/product/*`와 `docs/domain.md`
- 기준 Figma 파일 링크
- 수정할 페이지와 프레임
- 새 컴포넌트가 필요한지, 기존 컴포넌트 수정으로 충분한지

Figma 반영 후 확인한다.

- 필요한 페이지와 프레임이 실제로 존재하는가
- 만든 프레임이 비어 있지 않은가
- 기획 변경이 화면에 빠짐없이 반영됐는가
- 준비중 기능이 실제 기능처럼 노출되지 않았는가

## 3단계: UI 검증 반복

`tft-doubleup-ui-validation`을 따른다.

검증 순서:

1. Figma 페이지와 최종 프레임 존재 여부를 확인한다.
2. 최종 프레임 스크린샷 또는 노드 상태를 확보한다.
3. 전체 체크리스트를 처음부터 끝까지 검증한다.
4. 하나라도 실패하면 `불합격`으로 판정한다.
5. 실패 원인을 기록하고 Figma를 수정한다.
6. 수정 후 다시 1번부터 전체 검증한다.
7. 모든 기준을 통과할 때만 완료한다.

반드시 검증할 항목:

- Figma 페이지/프레임 존재 여부
- 레이아웃 구조와 오토레이아웃 계층
- padding, gap, align
- 텍스트 overflow와 겹침
- 반복 모집 카드 리듬
- 왼쪽 필터 패널 overflow
- 우측 패널 작은 리스트 UI
- 모바일 카드와 하단 액션바
- 부모 컨테이너 밖으로 나가는 자식 요소
- MVP 제외 기능 노출 여부

## 완료 조건

아래 조건을 모두 만족해야 완료한다.

- `docs/` 기획 문서가 변경 요구사항을 반영한다.
- `./scripts/check.sh`가 통과한다.
- 기준 Figma 파일에 변경 사항이 반영된다.
- 필요한 최종 Figma 프레임이 존재하고 비어 있지 않다.
- `tft-doubleup-ui-validation` 기준으로 마지막 검증이 통과한다.
- 최종 보고에 Figma 링크, 수정한 docs, 수정한 Figma 페이지/프레임, 마지막 검증 결과를 포함한다.

## 중단 조건

다음 경우에는 완료 보고를 하지 말고 사용자에게 상태를 알린다.

- Figma 파일 접근 권한이 없다.
- Figma MCP 조회가 불안정해서 페이지/프레임 존재를 확인할 수 없다.
- Figma MCP 호출이 `user cancelled MCP tool call`로 취소된다.
- 기획 요구사항이 MVP 포함/제외 정책과 충돌하지만 사용자의 의도가 불명확하다.
- 검증 실패를 수정하려면 제품 범위나 UX 정책 변경이 필요하다.
- 이미지 생성, 외부 에셋, 새 Figma 파일 생성처럼 사용자의 명시 확인이 필요한 작업이 생긴다.

## 응답 방식

작업 전에는 사용할 세 스킬과 변경 범위를 짧게 말한다. 작업 중에는 docs 수정, Figma 반영, 검증 루프의 현재 단계를 알려준다. 최종 답변은 길게 설명하지 말고 다음만 보고한다.

- 수정한 기획 문서
- 수정한 Figma 파일/페이지/프레임
- 마지막 검증 결과
- 남은 리스크 또는 사용자가 확인해야 할 결정
