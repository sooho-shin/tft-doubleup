# 데이터베이스 구현 기준

## 선택

데이터베이스는 PostgreSQL을 기준으로 한다.

- 로컬 개발: Docker Postgres
- MVP 배포 후보: Supabase Postgres
- ORM/마이그레이션: Drizzle

## 핵심 테이블

### users

인증 주체다. Supabase Auth를 사용하면 Supabase user id와 연결한다.

필드:

- `id`
- `email`
- `created_at`
- `updated_at`

### profiles

반복 매칭에 쓰는 사용자 프로필이다.

필드:

- `id`
- `user_id`
- `display_name`
- `riot_id`
- `server`
- `double_up_tier`
- `gender_visibility`
- `discord_mode`
- `purpose`
- `play_style_tags`
- `availability_status`
- `bio`
- `contact_channel`
- `created_at`
- `updated_at`

규칙:

- `server`는 MVP에서 `KR`만 허용한다.
- `gender_visibility` 기본값은 `private`다.
- `contact_channel`은 신청 수락 후에만 API가 노출한다.

### rooms

사용자-facing으로는 모집방이다. 내부 구현에서는 `rooms` 또는 `recruitment_posts` 중 하나를 선택하되, API와 UI에서는 `room` 용어를 우선한다.

필드:

- `id`
- `host_profile_id`
- `title`
- `server`
- `tier_min`
- `tier_max`
- `purpose`
- `discord_mode`
- `play_style_tags`
- `availability_status`
- `description`
- `wanted_partner`
- `status`
- `created_at`
- `updated_at`

규칙:

- 생성 직후 `status`는 `open`이다.
- 기본 목록은 `open` 방을 우선 노출한다.
- `availability_status`가 지금 가능한 값을 우선 정렬한다.
- 예약 시간, 미래 가능 시간, 시간 조율 컬럼은 만들지 않는다.
- 추천 점수와 랭킹 컬럼은 만들지 않는다.

### room_applications

모집방 신청이다.

필드:

- `id`
- `room_id`
- `applicant_profile_id`
- `message`
- `gender_visibility`
- `status`
- `created_at`
- `updated_at`
- `decided_at`

규칙:

- 같은 방에 같은 사용자의 활성 신청은 하나만 허용한다.
- `status`는 `pending`, `accepted`, `rejected`, `cancelled`만 허용한다.
- 방장만 `accepted` 또는 `rejected`로 변경할 수 있다.
- `accepted` 이후에만 연락처 조회 API가 응답한다.

## enum 기준

`docs/domain.md`의 값을 따른다.

DB 값은 영어 snake_case 또는 짧은 code를 사용하고, 한국어 라벨은 `packages/domain`의 label map에서 제공한다.

## 인덱스 기준

초기 인덱스:

- `rooms(status, availability_status, created_at)`
- `rooms(purpose)`
- `rooms(discord_mode)`
- `room_applications(room_id, status)`
- `room_applications(applicant_profile_id, status)`
- `profiles(user_id)`

## seed data 기준

seed는 UI와 API 검증을 위해 아래 상태를 포함한다.

- 모집중 방 5개 이상
- 지금 가능 방 3개 이상
- 매칭완료 방 1개
- 마감 방 1개
- 내 신청 상태 `pending`, `accepted`, `rejected` 각각 1개
- 티어/목적/디스코드/플레이 스타일 조합이 다른 방

MVP 제외 문구와 필드는 seed에도 넣지 않는다.
