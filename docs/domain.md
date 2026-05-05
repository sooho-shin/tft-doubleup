# 도메인 모델

## 공통 원칙

- MVP 서버는 `KR`로 고정한다.
- 예약과 미래 시간대 모집은 다루지 않는다.
- 지금 가능한지 여부가 핵심 조건이다.
- 값은 UI 라벨과 API 값이 섞이지 않도록 구현 시 enum 또는 상수로 관리한다.
- 내부 도메인명은 `RecruitmentPost`를 유지하되, 사용자에게는 `방` 또는 `모집방`으로 노출한다.

## 값 목록

### Server

MVP에서는 하나만 사용한다.

- `KR`: 한국 서버

### DiscordMode

- `talk`: 대화 가능
- `listen_only`: 듣기만 가능
- `unavailable`: 디스코드 불가능

### Purpose

- `rank_up`: 랭크 상승
- `top4`: 순방 위주
- `casual`: 즐겜
- `practice`: 연습
- `beginner_friendly`: 초보 환영
- `fixed_duo`: 고정 듀오
- `mission_event`: 미션/이벤트

### PlayStyleTag

- `standard`: 운영덱
- `reroll`: 리롤덱
- `tempo`: 템포 운영
- `win_streak`: 연승 운영
- `loss_streak`: 연패 운영
- `meta`: 메타덱 선호
- `flex`: 유연한 운영
- `top4`: 순방 위주
- `first_place`: 1등 노림
- `item_consult`: 아이템 상담
- `positioning_review`: 배치 같이 보기
- `communicative`: 소통 선호
- `quiet`: 조용히 플레이

### AvailabilityStatus

- `available_now`: 지금 가능
- `one_game`: 바로 1판 가능
- `two_games`: 바로 2판 가능
- `in_game`: 현재 플레이 중

### RecruitmentStatus

- `open`: 모집중
- `matched`: 매칭완료
- `closed`: 마감

### JoinRequestStatus

- `pending`: 대기중
- `accepted`: 수락
- `rejected`: 거절
- `cancelled`: 취소

### GenderVisibility

사용자가 직접 입력하는 본인 성별 공개값이다. MVP에서는 필터나 추천 신호로 쓰지 않는다.

- `male`: 남성
- `female`: 여성
- `private`: 비공개

## UserProfile

사용자의 더블업 매칭 프로필이다.

필드:

- `id`
- `displayName`
- `riotId`
- `server`: MVP에서는 `KR`
- `doubleUpTier`
- `genderVisibility`
- `discordMode`
- `playStyleTags`
- `purpose`
- `bio`
- `availabilityStatus`
- `contactChannel`
- `createdAt`
- `updatedAt`

규칙:

- `displayName`은 카드와 신청 내역에서 노출된다.
- `riotId`는 사용자가 입력하되 MVP에서는 Riot API로 검증하지 않는다.
- `genderVisibility` 기본값은 `private`다.
- 성별은 본인 정보로만 표시하고 매칭 점수, 자동 추천, 필터 조건으로 사용하지 않는다.
- `contactChannel`은 신청이 수락된 사용자에게만 노출한다.
- `bio`는 매칭 핵심 신호가 아니므로 카드에서 길게 노출하지 않는다.

## RecruitmentPost

파트너를 찾는 모집방이다. 구현 내부에서는 `RecruitmentPost`를 사용할 수 있지만, 사용자-facing 화면과 문구에서는 `방` 또는 `모집방`으로 표현한다.

필드:

- `id`
- `title`
- `authorId`
- `authorGenderVisibility`
- `server`: MVP에서는 `KR`
- `tierMin`
- `tierMax`
- `purpose`
- `availableNow`
- `availabilityStatus`
- `discordMode`
- `playStyleTags`
- `description`
- `status`
- `createdAt`
- `updatedAt`

방 생성 필수 입력:

- `title`
- `authorId`
- `authorGenderVisibility`
- `tierMin`
- `tierMax`
- `purpose`
- `availabilityStatus`
- `discordMode`
- `playStyleTags`
- `description` 또는 한 줄 설명

방 생성 선택 입력:

- 원하는 파트너 설명
- 상세 설명

방 생성 고정값:

- `server`: `KR`
- `authorGenderVisibility`: 사용자가 입력한 본인 성별 공개값, 기본값은 `private`
- `availableNow`: 지금 가능 상태 기준으로 계산하거나 직접 저장
- `status`: 생성 직후 `open`

규칙:

- `status`가 `open`인 글만 기본 목록에 노출한다.
- `availableNow`가 true인 글을 우선 정렬한다.
- `tierMin`과 `tierMax`는 티어 범위 필터에 사용한다.
- `description`은 상세 화면에서 읽게 하고 카드에서는 핵심 태그를 우선한다.
- 생성 완료 후 사용자는 생성된 방 상세로 이동한다.
- 예약 시간, 미래 시간대, 시간 조율 필드는 MVP 도메인에 넣지 않는다.
- 성별 기반 검색 필터나 추천 점수는 MVP 도메인에 넣지 않는다.

## JoinRequest

모집방에 보내는 신청이다.

필드:

- `id`
- `postId`
- `requesterId`
- `requesterGenderVisibility`
- `message`
- `status`
- `createdAt`
- `updatedAt`

규칙:

- 한 사용자는 같은 방에 활성 신청을 하나만 보낼 수 있다.
- `requesterGenderVisibility` 기본값은 `private`다.
- 작성자는 `pending` 신청을 `accepted` 또는 `rejected`로 변경할 수 있다.
- `accepted`가 되면 연락 정보 확인이 가능하다.
- 방이 `matched` 또는 `closed`가 되면 새 신청을 받을 수 없다.

## 매칭 적합성 신호

높음:

- 비슷한 티어 또는 허용 가능한 티어 범위
- 같은 플레이 목적
- 디스코드 대화 방식 일치
- 지금 플레이 가능

중간:

- 플레이 스타일 호환
- 최근 활동
- 응답률

낮음:

- 긴 자기소개
- 프로필 장식
- 단순 인기

MVP에서는 추천 점수를 계산하지 않는다. 위 신호는 정렬, 필터, 카드 정보 우선순위를 정하는 기준으로만 사용한다.
