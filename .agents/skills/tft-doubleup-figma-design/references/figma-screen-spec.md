# Figma 화면 명세

## 메인 매칭 보드

프레임:

- 이름: `Desktop / Matching Board`
- 크기: 1440 x 1024
- 배경: `#0E1118`

목표 톤:

- lolchess.gg와 매우 가까운 다크 정보형 TFT 도구 화면
- 넓은 히어로 없이 실제 모집 정보가 첫 화면에 노출
- 촘촘한 상단 네비게이션, 작은 배지, 얇은 보더, 정보형 카드/테이블 중심

섹션:

1. 최상단 서비스 바
   - 서비스 로고 텍스트
   - 관련 서비스 링크 자리
   - 지역 선택 `KR`
   - 언어 선택
   - Riot ID 로그인

2. 주요 네비게이션
   - 로고
   - 팀원찾기
   - 모집글
   - 파트너 추천: 클릭 시 `준비중입니다.`
   - 랭킹: 클릭 시 `준비중입니다.`
   - 가이드: 클릭 시 `준비중입니다.`
   - 로그인
   - 모집하기 버튼

3. 검색/필터 바
   - 키워드 또는 Riot ID 검색
   - 한국 서버(KR) 고정 표시
   - 티어 선택
   - 목적 선택
   - 디스코드 선택
   - 지금 가능 토글

4. 왼쪽 필터 패널
   - 티어 범위
   - 목적
   - 디스코드
   - 플레이 스타일

5. 가운데 실시간/추천 모집 리스트
   - lolchess 추천 메타 리스트처럼 촘촘한 모집 카드 5-7개
   - 각 카드에 KR 서버, 티어, 지금 가능 상태, 제목, 목적, 디스코드, 태그, 신청 버튼 포함

디스코드 필드는 타이틀을 `디스코드`로 쓰고, 선택지는 `대화 가능`, `듣기만 가능`, `디스코드 불가능` 3개만 사용한다.

MVP에서는 서버 선택 드롭다운과 다중 서버 필터를 만들지 않는다. 서버 표시는 `KR` 또는 `한국 서버` 고정 배지/라벨로 처리한다.
MVP에서는 예약제와 미래 시간대 모집을 만들지 않는다. `평일 21:00`, `주말 오후`, `시간 조율` 같은 시간 배지/필터 대신 `지금 가능`, `바로 1판`, `바로 2판`, `현재 플레이 중` 같은 즉시 가능 상태를 사용한다.

6. 오른쪽 사이드 패널
   - 최근 모집글
   - 내 신청 상태
   - 서비스 공지

MVP에서는 `파트너 추천`, `랭킹`, `가이드`를 실제 화면이나 패널로 만들지 않는다. 해당 네비게이션을 누르면 `준비중입니다.` 모달 또는 상태를 보여준다.

레이아웃 구조:

```text
Page/Desktop Matching Board
  Frame/AppShell
    Organism/Nav/ServiceBar
    Organism/Nav/Main
    Molecule/SearchBar/Global
    Frame/ContentGrid
      Organism/Filters/Sidebar
      Frame/MainColumn
        Organism/RecruitmentList
      Frame/RightRail
        Organism/Panel/RecentPosts
        Organism/Panel/MyRequests
        Organism/Panel/Notice
```

- `AppShell`은 세로 Auto Layout이다.
- `ContentGrid`는 가로 Auto Layout이다.
- `MainColumn`, `RightRail`, `RecruitmentList`는 세로 Auto Layout이다.
- 각 카드 내부는 `Header`, `Body`, `Meta`, `Tags`, `Actions` 자식 프레임을 둔다.
- 주요 간격은 좌표가 아니라 padding과 gap으로 제어한다.

## 모집글 상세

프레임:

- 이름: `Desktop / Recruitment Detail`
- 크기: 1440 x 1024

섹션:

- 모집글 제목과 상태
- 작성자 프로필 요약
- 조건 요약
- 상세 설명
- 신청 메시지 입력
- 신청하기 버튼
- 비슷한 모집글

레이아웃 구조:

```text
Page/Desktop Recruitment Detail
  Frame/AppShell
    Organism/Nav/Main
    Frame/DetailGrid
      Frame/DetailMain
        Organism/PostDetail/Header
        Organism/PostDetail/ConditionSummary
        Organism/PostDetail/Description
      Frame/DetailAside
        Organism/ProfileCard/Summary
        Organism/Panel/RequestForm
        Organism/Panel/SimilarPosts
```

## 모바일 매칭 보드

프레임:

- 이름: `Mobile / Matching Board`
- 크기: 390 x 844

섹션:

- 상단 로고/검색
- 필터 버튼
- 지금 가능 토글
- 단일 컬럼 모집 카드
- 하단 모집하기 액션

레이아웃 구조:

```text
Page/Mobile Matching Board
  Frame/MobileShell
    Organism/Nav/MobileTop
    Molecule/SearchBar/Mobile
    Molecule/FilterSummary/Mobile
    Organism/RecruitmentList/Compact
    Organism/BottomActionBar
```

## Atomic Design 컴포넌트 목록

### Atoms

- `Atom/Button/Primary`
- `Atom/Button/Secondary`
- `Atom/Button/Ghost`
- `Atom/Input/Search`
- `Atom/Input/Text`
- `Atom/Select/Default`
- `Atom/Toggle/Availability`
- `Atom/Badge/Tier`
- `Atom/Badge/Discord`
- `Atom/Badge/Availability`
- `Atom/Tag/PlayStyle`
- `Atom/IconButton/Filter`

### Molecules

- `Molecule/SearchBar/Global`
- `Molecule/ServerIndicator/KRFixed`
- `Molecule/FilterGroup/Tier`
- `Molecule/FilterGroup/Purpose`
- `Molecule/MetaRow/PostInfo`
- `Molecule/ProfileMini/Author`
- `Molecule/RequestAction/Inline`

### Organisms

- `Organism/Nav/Top`
- `Organism/Filters/Sidebar`
- `Organism/RecruitmentCard/Default`
- `Organism/RecruitmentCard/Compact`
- `Organism/Panel/RecentPosts`
- `Organism/Panel/MyRequests`
- `Organism/Panel/Notice`
- `Organism/Panel/RequestForm`
- `Organism/Modal/ComingSoon`

### Templates

- `Template/DesktopMatchingBoard`
- `Template/RecruitmentDetail`
- `Template/MobileMatchingBoard`

### Pages

- `Page/Desktop Matching Board`
- `Page/Desktop Recruitment Detail`
- `Page/Mobile Matching Board`
