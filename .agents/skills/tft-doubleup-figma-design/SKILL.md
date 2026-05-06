---
name: tft-doubleup-figma-design
description: 이 저장소 안에서 Figma MCP와 figma-skills를 사용해 TFT 더블업 팀원 매칭 서비스의 Figma 디자인 파일, 화면, 컴포넌트, 디자인 토큰을 만들거나 수정할 때 사용하는 프로젝트 전용 스킬.
---

# TFT 더블업 Figma 디자인

## 목적

이 스킬은 TFT 더블업 팀원 매칭 서비스를 Figma로 만들 때의 작업 절차를 정한다. 제품 판단은 `tft-doubleup-product` 스킬을 기준으로 하고, 이 스킬은 Figma 파일 생성, 화면 구성, Atomic Design 기반 컴포넌트화, 레이어 구조, 검증에 집중한다.

## 역할 구분

- `tft-doubleup-product`: 무엇을 만들지 정한다. MVP, 사용자 흐름, 정보 구조, UX 문구, 디자인 방향을 다룬다.
- `tft-doubleup-figma-design`: 정해진 내용을 Figma에 어떻게 만들지 정한다. 파일, 페이지, 프레임, Atomic Design 컴포넌트, 오토레이아웃, 변수, 레이어 이름을 다룬다.

제품 범위가 불명확하면 Figma를 만들기 전에 먼저 `tft-doubleup-product`를 참고해 화면 목적과 구성요소를 확정한다.

## Figma 작업 흐름

1. 작업 범위를 확인한다.
   - 새 파일 생성
   - 기존 파일 수정
   - 메인 매칭 보드 제작
   - 모집글 상세 제작
   - 프로필 화면 제작
   - 모바일 화면 제작
   - 컴포넌트/토큰 정리
   - 이미지 에셋 생성 또는 업로드

2. lolchess.gg 기준을 확인한다.
   - 최신 화면을 직접 확인할 수 있으면 `https://lolchess.gg/?hl=ko`를 열어 현재 톤, 네비게이션, 정보 밀도, 카드/테이블 구성을 확인한다.
   - 목표는 lolchess.gg와 매우 가까운 다크 정보형 TFT 도구 톤이다.
   - 단, 로고, 브랜드명, 고유 이미지, 챔피언/아이템/특성 에셋, 정확한 레이아웃 복제는 하지 않는다.

3. Figma 도구 사용 전 필요한 MCP 문서를 확인한다.
   - 새 파일을 만들 때: Figma `create_new_file` 관련 문서
   - 캔버스에 작성할 때: Figma `use_figma` / write-to-canvas 관련 문서
   - 웹 화면을 캡처할 때: Figma `generate_figma_design` 관련 문서

4. 프로젝트 기준 Figma 파일은 `references/figma-file-link.md`에 저장된 링크를 우선 사용한다.

### Figma MCP 실행 방식

Figma 파일을 만들거나 수정할 때는 기본적으로 Codex가 직접 `use_figma`를 순차 호출한다.

- `ooo ralph`, Ouroboros evolve, 병렬 worker처럼 여러 하위 세션이 동시에 Figma MCP를 호출하는 방식은 사용자가 명시적으로 요청하지 않는 한 사용하지 않는다.
- Figma MCP 연결 확인은 `whoami` → 기준 파일 read-only `use_figma` 조회 → 필요한 경우 `get_libraries` 순서로 한다.
- `get_metadata`의 root node 조회가 실패해도 곧바로 연결 실패로 판단하지 않는다. 같은 fileKey에 대해 read-only `use_figma`가 성공하면 파일 접근은 가능한 것으로 보고, 이후 작업도 `use_figma` 중심으로 진행한다.
- 한 번의 `use_figma` 호출에서 전체 파일을 크게 재작성하지 않는다. 페이지 생성, Foundation/Atoms 정리, Template 수정, Page 프레임 생성, 검증처럼 작은 단계로 나눈다.
- 각 수정 단계가 끝나면 read-only `use_figma`로 페이지/프레임 존재와 childCount를 확인한 뒤 다음 단계로 넘어간다.
- `user cancelled MCP tool call`, 권한 오류, 빈 children 조회 같은 비정상 응답이 나오면 자동 재시도 루프를 돌리지 말고 즉시 중단해 원인과 마지막으로 성공한 단계를 보고한다.
- 병렬 호출이 필요한 특수 상황이라도 같은 Figma fileKey를 대상으로 한 `use_figma` 쓰기 호출은 동시에 실행하지 않는다.

5. 새 Figma 파일을 만들 때는 사용자의 명시 요청이 있거나, 작업 목적상 새 파일이 필요한 경우에만 만든다.
   - 파일 이름에는 `TFT DoubleUp`과 산출물 목적을 포함한다.
   - 파일 생성 후에는 이후 작업에 `file_key`를 사용한다.

6. 화면을 만들 때는 Figma-native 구조로 작성한다.
   - 프레임
   - 오토레이아웃
   - Atomic Design 단계별 재사용 컴포넌트
   - 부모-자식 관계가 명확한 flexbox형 레이아웃
   - 의미 있는 레이어 이름
   - 색상/간격/타이포그래피 변수 또는 스타일
   - 좌표 기반 absolute 배치는 불가피한 장식/오버레이에만 제한적으로 사용

7. 이미지 에셋이 필요하면 `imagegen` 스킬을 사용한다.
   - Figma에서 직접 그리기 어려운 비트맵 에셋, 배경 이미지, 일러스트, 질감, 오브젝트 컷아웃이 필요할 때만 생성한다.
   - 단순 아이콘, 배지, UI 도형, 와이어프레임 장식은 Figma 벡터/도형으로 만든다.
   - 기본 경로는 내장 이미지 생성 도구다. 모델명을 직접 지정할 수 있는 흐름은 CLI fallback이므로 사용자가 명시적으로 요청하거나 필요한 조건을 확인한 뒤 사용한다.
   - 사용자가 `gpt-image-2` 또는 `GPT Image 2.0`을 명시하면, 현재 도구에서 모델 선택 가능 여부를 확인하고 불가능하면 내장 이미지 생성 도구 또는 CLI fallback 조건을 설명한다.
   - 생성된 프로젝트용 에셋은 반드시 workspace 안에 저장한 뒤 Figma에 업로드한다. `$CODEX_HOME/generated_images`에만 남겨둔 파일을 Figma나 코드에서 참조하지 않는다.
   - 투명 배경이 필요하면 이미지 생성 스킬의 chroma-key 제거 절차를 우선 사용한다. true/native transparency나 CLI fallback은 사용자 확인 후 진행한다.

8. 결과를 만든 뒤에는 간단히 검증한다.
   - 기준 페이지 구조가 실제 Figma 파일에 남아 있는가
   - 각 페이지에 필요한 최상위 프레임과 컴포넌트가 비어 있지 않은가
   - 핵심 정보가 첫 화면에 보이는가
   - 카드와 필터가 실제 서비스처럼 동작할 수 있는 구조인가
   - 레이어 이름이 의미 있는가
   - Atomic Design 계층이 지켜졌는가
   - 컴포넌트 재사용이 가능한가
   - lolchess.gg와 톤, 정보 밀도, 화면 리듬이 충분히 가까운가
   - lolchess.gg를 참고했지만 고유 자산이나 세부 표현을 직접 복제하지 않았는가
   - 주요 레이아웃이 좌표 기반이 아니라 부모-자식 오토레이아웃 구조인가
   - 생성 이미지 에셋이 있다면 프로젝트 안에 저장되고 Figma에 정상 업로드됐는가

9. 최종 보고 전에는 Figma 파일 구조를 도구로 다시 확인한다.
   - `00 Foundation`, `01 Atoms`, `02 Molecules`, `03 Organisms`, `04 Templates`, `05 Pages`, `99 Notes`가 모두 존재해야 한다.
   - 작은 시안처럼 일부 페이지를 생략한 경우에도 사용자가 요청한 화면과 컴포넌트 페이지가 실제로 비어 있지 않은지 확인해야 한다.
   - `05 Pages`에는 최소 `Page/Desktop Matching Board`, `Page/Desktop Recruitment Detail`, `Page/Mobile Matching Board` 프레임이 있어야 한다.
   - Figma MCP 실행 중 페이지 children이 비어 보이거나 간헐적으로 조회가 흔들리면 완료 보고를 하지 않는다. 같은 파일을 다시 조회하거나 스크린샷으로 실제 존재 여부를 확인한다.
   - 최종 답변에는 만든 페이지 수, 핵심 프레임 수, 마지막 검증 결과를 사실대로 적는다.

## lolchess.gg 디자인 기준

이 프로젝트의 기본 시각 목표는 lolchess.gg와 매우 가까운 TFT 정보 사이트 톤이다. Figma 시안을 만들 때는 아래 특징을 우선 반영한다.

- 어두운 네이비/차콜 배경 위에 밝은 다크 패널을 올린다.
- 상단에는 서비스군 링크, 지역/언어, 로그인, 주요 메뉴가 있는 촘촘한 네비게이션을 둔다.
- 첫 화면에는 마케팅 문구보다 실제 콘텐츠 섹션을 먼저 보여준다.
- 메인 콘텐츠는 추천 메타 카드처럼 정보가 많은 리스트/카드 형태로 구성한다.
- 오른쪽 또는 하단에는 최근 모집글, 내 신청 상태, 서비스 공지 같은 MVP 보조 정보 패널을 둔다.
- 작은 아이콘, 배지, 티어 표시, 상태 라벨, 짧은 링크 텍스트를 많이 사용한다.
- 여백은 넓게 쓰지 않고, 정보 간 구분은 배경 톤 차이와 얇은 보더로 처리한다.
- 버튼은 크고 화려하기보다 작고 기능적으로 만든다.

더블업 서비스로 치환할 때의 대응:

- lolchess의 `추천 메타` 영역은 `실시간 모집 파트너` 영역으로 바꾼다.
- lolchess의 챔피언/아이템 아이콘 밀도는 `티어 배지`, `디스코드 배지`, `플레이 스타일 태그`, `지금 가능 상태`, `KR 서버 고정 표시` 정보로 대체한다.
- lolchess의 `최근 게시물`은 `최근 모집글` 또는 `최근 신청 활동`으로 바꾼다.
- lolchess의 `글로벌 TOP 10` 같은 랭킹 영역은 MVP에서 만들지 않는다.
- lolchess의 게시판 메뉴는 `모집글` 중심으로 바꾸고, `파트너 추천`, `랭킹`, `가이드`는 클릭 시 `준비중입니다.` 상태를 보여주는 네비게이션 항목으로만 둔다.

금지:

- LoLCHESS.GG, DAK.GG, Riot, TFT 로고를 그대로 쓰지 않는다.
- 챔피언 초상화, 아이템 아이콘, 특성 아이콘을 무단 에셋처럼 쓰지 않는다.
- 픽셀 단위로 같은 레이아웃을 복제하지 않는다.
- 원문 게시물, 랭킹 이름, 실제 유저 데이터를 그대로 옮기지 않는다.

## 기본 페이지 구조

Figma 파일에는 필요에 따라 다음 페이지를 둔다.

- `00 Foundation`: 색상, 타이포그래피, 간격, 반경, 그림자 기준
- `01 Atoms`: 버튼, 입력, 셀렉트, 토글, 배지, 태그, 아이콘 버튼
- `02 Molecules`: 검색 필드 묶음, 필터 그룹, 티어/상태 행, 카드 메타 행, 프로필 미니 요약
- `03 Organisms`: 상단 네비게이션, 필터 사이드바, 모집 카드, 최근 모집글 패널, 신청 패널, 준비중 모달
- `04 Templates`: 데스크톱 매칭 보드 템플릿, 상세 화면 템플릿, 모바일 리스트 템플릿
- `05 Pages`: 실제 콘텐츠가 들어간 데스크톱/모바일 화면
- `99 Notes`: 결정사항, 미정 사항, 다음 작업

작은 시안이라도 최소한 `00 Foundation`, `01 Atoms`, `03 Organisms`, `05 Pages`는 분리한다.

## 레이아웃 구조 원칙

Figma 구조는 이후 프론트엔드 코드에서 flexbox로 옮기기 쉬워야 한다. 좌표를 직접 찍어 배치하는 방식보다 부모 프레임의 방향, gap, padding, align, stretch를 사용한다.

기본 규칙:

- 모든 주요 섹션은 부모 프레임을 만들고 Auto Layout을 적용한다.
- 화면 전체는 세로 방향 부모 프레임으로 구성한다.
- 콘텐츠 영역은 `Nav`, `SearchBar`, `ContentGrid`, `Footer`처럼 의미 단위의 자식 프레임으로 나눈다.
- `ContentGrid` 안에서는 왼쪽 필터, 중앙 리스트, 오른쪽 패널을 자식 프레임으로 둔다.
- 리스트와 카드 묶음은 세로 Auto Layout과 일정한 gap으로 만든다.
- 카드 내부는 `Header`, `Body`, `Meta`, `Tags`, `Actions` 같은 자식 프레임으로 나눈다.
- 요소 간 간격은 x/y 좌표가 아니라 padding과 gap으로 제어한다.
- 반응형을 고려해 고정 좌표보다 fill container, hug contents, min/max width 성격을 우선한다.
- 반복 리스트 아이템은 반드시 `RankBadge + TextGroup`, `Icon + TextGroup`, `Meta + Action`처럼 부모 프레임으로 묶는다.
- 우측 패널의 최근 모집글/내 신청 상태 리스트처럼 작은 UI도 Auto Layout과 gap으로 구성한다. 배지와 텍스트를 단순 좌표로 나열하지 않는다.
- 한국어 라벨과 태그는 글자 폭이 넓어질 수 있으므로 최소 폭과 내부 padding을 넉넉히 잡고, 텍스트가 1줄 라벨 안에서 쪼개지지 않게 한다.

좌표/absolute 성격 배치가 허용되는 경우:

- 작은 상태 점, 알림 뱃지, 드롭다운 팝오버, 모달 오버레이처럼 기준 요소 위에 겹쳐야 하는 UI
- 시각적 장식이지만 레이아웃 흐름에 영향을 주면 안 되는 요소
- Figma 도구 한계로 오토레이아웃만으로 표현이 어려운 일부 레이어

허용하더라도 기준 프레임 안에서 상대적인 위치 관계가 드러나게 이름을 붙인다. 예: `Badge/NotificationOverlay`, `Popover/FilterMenu`.

좌표 기반 fallback을 사용했더라도 다음 항목에는 사용하지 않는다.

- 최근 모집글/내 신청 상태 패널의 반복 행
- 모집 카드의 배지, 태그, 작성자/액션 행
- 모바일 카드 내부 정보 행
- 버튼과 텍스트가 함께 있는 행

위 항목이 좌표 기반으로 만들어졌다면 최종 산출 전에 Auto Layout 구조로 재정리한다.

## Atomic Design 기준

컴포넌트는 작은 단위에서 큰 단위로 조립한다. 큰 화면을 먼저 그리고 나중에 컴포넌트로 뜯어내는 방식은 피한다.

Atoms:

- 더 이상 서비스 의미 단위로 쪼개기 어려운 기본 요소다.
- 예: `Button/Primary`, `Input/Search`, `Select/Default`, `Toggle/Availability`, `Badge/Tier`, `Tag/PlayStyle`, `IconButton/Filter`

Molecules:

- Atoms를 조합한 작은 기능 단위다.
- 단독으로 의미는 있지만 화면 섹션 전체는 아니다.
- 예: `SearchBar/Global`, `FilterGroup/Tier`, `MetaRow/PostInfo`, `ProfileMini/Author`, `RequestAction/Inline`

Organisms:

- Molecules와 Atoms를 조합한 주요 화면 섹션이다.
- 실제 제품 영역으로 재사용될 수 있어야 한다.
- 예: `Nav/Top`, `Filters/Sidebar`, `RecruitmentCard/Default`, `Panel/RecentPosts`, `Panel/RequestForm`, `Modal/ComingSoon`

Templates:

- 실제 데이터 없이 화면 골격과 배치만 정의한다.
- 예: `Template/DesktopMatchingBoard`, `Template/RecruitmentDetail`, `Template/MobileMatchingBoard`

Pages:

- 실제 예시 데이터가 들어간 최종 화면이다.
- 예: `Page/Desktop Matching Board`, `Page/Desktop Recruitment Detail`, `Page/Mobile Matching Board`

계층 규칙:

- Atoms는 Molecules나 Organisms에 의존하지 않는다.
- Molecules는 Organisms에 의존하지 않는다.
- Organisms는 Templates/Pages에 의존하지 않는다.
- Templates는 실제 콘텐츠보다 배치와 상태를 보여준다.
- Pages에서 실제 모집글, 티어, 태그, 사용자명을 넣는다.

## 기본 프레임 세트

우선순위:

1. `Desktop / Matching Board`
   - 상단 네비게이션
   - 검색/필터 바
   - 왼쪽 필터 패널
   - 가운데 모집글 리스트
   - 오른쪽 최근 모집글/내 신청 상태/공지 패널

2. `Desktop / Recruitment Detail`
   - 모집글 상세
   - 작성자 프로필 요약
   - 신청 메시지 입력
   - 비슷한 모집글

3. `Mobile / Matching Board`
   - 상단 검색
   - 필터 바텀시트 트리거
   - 단일 컬럼 모집 카드
   - 하단 주요 액션

## 레이어 이름 규칙

영어 컴포넌트명과 한글 화면명을 섞어도 된다. 반복 컴포넌트는 영어로 안정적으로 이름을 붙인다.

예시:

- `Atom/Button/Primary`
- `Atom/Badge/Tier`
- `Atom/Tag/PlayStyle`
- `Molecule/SearchBar/Global`
- `Molecule/MetaRow/PostInfo`
- `Molecule/ProfileMini/Author`
- `Organism/Nav/Top`
- `Organism/Filters/Sidebar`
- `Organism/RecruitmentCard/Default`
- `Organism/Panel/RecentPosts`
- `Organism/Panel/MyRequests`
- `Organism/Modal/ComingSoon`
- `Template/DesktopMatchingBoard`
- `Page/Desktop Matching Board`

부모-자식 구조 예시:

```text
Page/Desktop Matching Board
  Nav/Top
  Search/SearchBand
  Layout/ContentGrid
    Organism/Filters/Sidebar
    Layout/MainColumn
      Organism/RecruitmentList
        Organism/RecruitmentCard/Default
    Layout/RightRail
      Organism/Panel/RecentPosts
      Organism/Panel/MyRequests
```

## 디자인 기준

- lolchess.gg와 매우 가까운 다크 정보형 UI를 기본으로 한다.
- 첫 화면에서 실제 모집글이 보여야 한다.
- 필터와 모집 카드의 정보 위계를 가장 중요하게 둔다.
- MVP에서는 서버 선택 드롭다운이나 다중 서버 필터를 만들지 않고, 한국 서버(KR) 고정 표시만 둔다.
- MVP에서는 예약제, 미래 시간대 선택, 시간 조율 UI를 만들지 않고, 지금 가능한 사람 중심의 상태와 액션만 둔다.
- 카드 radius는 6-8px 수준으로 유지한다.
- 카드 안에 또 다른 카드처럼 보이는 중첩 구조를 피한다.
- 티어 색상은 배지/작은 포인트에만 쓴다.
- 장식용 그래디언트, 큰 히어로, 과한 게임풍 장식을 피한다.

## Figma 도구 선택

- 새 Figma 파일이 필요하면 `create_new_file`을 사용한다.
- 직접 캔버스에 프레임/컴포넌트/변수를 만들 때는 `use_figma`를 사용한다.
- 이미 구현된 웹 화면을 Figma로 캡처할 때만 `generate_figma_design`을 사용한다.
- 생성한 이미지 파일을 Figma에 넣을 때는 `upload_assets`를 사용한다.
- 외부 웹사이트를 그대로 복제하기 위해 캡처하지 않는다. lolchess.gg는 강한 톤앤매너 참고용이다.

## 응답 방식

Figma 작업 전에는 만들 화면과 파일 변경 범위를 짧게 설명한다. 작업 후에는 Figma 링크, 만든 페이지/프레임, 남은 검토 포인트만 간결하게 보고한다.
