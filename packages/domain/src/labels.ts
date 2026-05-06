export const domainLabels = {
  server: {
    KR: "한국 서버"
  },
  discordMode: {
    talk: "대화 가능",
    listen_only: "듣기만 가능",
    unavailable: "디스코드 불가능"
  },
  purpose: {
    rank_up: "랭크 상승",
    top4: "순방 위주",
    casual: "즐겜",
    practice: "연습",
    beginner_friendly: "초보 환영",
    fixed_duo: "고정 듀오",
    mission_event: "미션/이벤트"
  },
  playStyleTag: {
    standard: "운영덱",
    reroll: "리롤덱",
    tempo: "템포 운영",
    win_streak: "연승 운영",
    loss_streak: "연패 운영",
    meta: "메타덱 선호",
    flex: "유연한 운영",
    top4: "순방 위주",
    first_place: "1등 노림",
    item_consult: "아이템 상담",
    positioning_review: "배치 같이 보기",
    communicative: "소통 선호",
    quiet: "조용히 플레이"
  },
  availabilityStatus: {
    available_now: "지금 가능",
    one_game: "바로 1판 가능",
    two_games: "바로 2판 가능",
    in_game: "현재 플레이 중"
  },
  recruitmentStatus: {
    open: "모집중",
    matched: "매칭완료",
    closed: "마감"
  },
  joinRequestStatus: {
    pending: "대기중",
    accepted: "수락",
    rejected: "거절",
    cancelled: "취소"
  },
  genderVisibility: {
    male: "남성",
    female: "여성",
    private: "비공개"
  }
} as const;
