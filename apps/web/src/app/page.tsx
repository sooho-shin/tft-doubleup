import React from "react";

const serviceLinks = ["전략적 팀 전투", "더블업 찾기", "전적검색", "메타"];
const navItems = ["팀원찾기", "모집방", "가이드"];

const rooms = [
  {
    id: "emerald-rank",
    tier: "Emerald II",
    tierClass: "tierEmerald",
    status: "지금 가능",
    title: "랭크 같이 올릴 더블업 파트너 구합니다",
    purpose: "랭크 상승",
    discord: "대화 가능",
    availability: "바로 2판",
    fit: "적합 92%",
    tags: ["운영덱", "소통 선호", "템포 운영"],
    host: "도전자연습생",
    hostMeta: "Emerald II · 3분 전"
  },
  {
    id: "diamond-top4",
    tier: "Diamond IV",
    tierClass: "tierDiamond",
    status: "지금 가능",
    title: "순방 위주로 침착하게 하실 분",
    purpose: "순방 위주",
    discord: "듣기만 가능",
    availability: "바로 1판",
    fit: "적합 88%",
    tags: ["메타덱 선호", "유연한 운영", "조용히 플레이"],
    host: "차분한8등방지",
    hostMeta: "Diamond IV · 5분 전"
  },
  {
    id: "platinum-beginner",
    tier: "Platinum I",
    tierClass: "tierPlatinum",
    status: "현재 플레이 중",
    title: "초보 환영, 배치 같이 보면서 해요",
    purpose: "초보 환영",
    discord: "대화 가능",
    availability: "바로 1판",
    fit: "적합 81%",
    tags: ["배치 같이 보기", "아이템 상담", "리롤덱"],
    host: "배치코치",
    hostMeta: "Platinum I · 8분 전"
  },
  {
    id: "master-first",
    tier: "Master",
    tierClass: "tierMaster",
    status: "지금 가능",
    title: "1등 노림 템포 빠른 운영 선호",
    purpose: "연습",
    discord: "디스코드 불가능",
    availability: "바로 2판",
    fit: "적합 79%",
    tags: ["1등 노림", "템포 운영", "연승 운영"],
    host: "블포러너",
    hostMeta: "Master · 12분 전"
  },
  {
    id: "gold-casual",
    tier: "Gold II",
    tierClass: "tierGold",
    status: "지금 가능",
    title: "즐겜이지만 기본 운영은 맞춰가실 분",
    purpose: "즐겜",
    discord: "듣기만 가능",
    availability: "바로 1판",
    fit: "적합 74%",
    tags: ["조용히 플레이", "순방 위주", "유연한 운영"],
    host: "느긋한더블업",
    hostMeta: "Gold II · 18분 전"
  }
];

const filterGroups: Array<[string, string[]]> = [
  ["티어", ["Gold+", "Platinum+", "Emerald+", "Diamond+"]],
  ["목적", ["랭크 상승", "순방 위주", "즐겜", "초보 환영"]],
  ["디스코드", ["대화 가능", "듣기만 가능", "디스코드 불가능"]],
  ["플레이 스타일", ["운영덱", "리롤덱", "템포 운영", "소통 선호", "조용히 플레이"]]
];

const recentRows = [
  ["랭크 상승 파트너 모집", "Emerald II · 지금 가능"],
  ["초보 환영 더블업", "Platinum I · 바로 1판"],
  ["순방 위주 조용히", "Diamond IV · 듣기만 가능"]
];

const requestRows = [
  ["요청 대기", "도전자연습생 · 3분 전"],
  ["수락됨", "차분한8등방지 · 연락처 보기"],
  ["거절됨", "템포러너 · 모집 마감"]
];

const noticeRows = [
  ["KR 서버 고정", "다중 서버는 다음 단계"],
  ["즉시 매칭 중심", "바로 가능 우선"],
  ["준비중 메뉴", "가이드는 준비중"]
];

function ServiceBar() {
  return (
    <div className="serviceBar">
      <div className="serviceInner">
        {serviceLinks.map((item) => (
          <span className={item === "더블업 찾기" ? "serviceActive" : undefined} key={item}>
            {item}
          </span>
        ))}
        <span className="serviceMeta">KR 한국어 로그인</span>
      </div>
    </div>
  );
}

function MainNav() {
  return (
    <nav className="mainNav" aria-label="주요 메뉴">
      <strong className="brand">DOUBLEUP.GG</strong>
      <div className="navItems">
        {navItems.map((item) => (
          <button className={item === "가이드" ? "navButton muted" : "navButton"} key={item} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="navActions">
        <button className="ghostButton" type="button">
          로그인
        </button>
        <button className="goldButton" type="button">
          방 만들기
        </button>
      </div>
    </nav>
  );
}

function Badge({
  children,
  tone = "neutral",
  dot = false
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "green" | "blue" | "purple" | "tierEmerald" | "tierDiamond" | "tierPlatinum" | "tierMaster" | "tierGold";
  dot?: boolean;
}) {
  return (
    <span className={`badge ${tone}`}>
      {dot ? <span className="dot" /> : null}
      {children}
    </span>
  );
}

function SearchBar() {
  return (
    <section className="searchBar" aria-label="검색과 빠른 필터">
      <label className="searchField">
        <span className="srOnly">키워드 검색</span>
        <input placeholder="키워드 검색" type="search" />
      </label>
      <Badge tone="gold">한국 서버 · KR 고정</Badge>
      <button className="selectButton" type="button">티어 전체</button>
      <button className="selectButton" type="button">목적 전체</button>
      <button className="selectButton" type="button">디스코드</button>
      <Badge tone="green" dot>지금 가능</Badge>
      <button className="goldButton compact" type="button">검색</button>
    </section>
  );
}

function FilterSidebar() {
  return (
    <aside className="filterPanel" aria-label="상세 필터">
      <div className="panelTitleRow">
        <h2>필터</h2>
        <span>KR 고정</span>
      </div>
      {filterGroups.map(([title, options]) => (
        <section className="filterGroup" key={title}>
          <h3>{title}</h3>
          <div className="filterOptions">
            {options.map((option) => (
              <button className="filterOption" key={option} type="button">
                {option}
              </button>
            ))}
          </div>
        </section>
      ))}
      <button className="goldButton fullWidth" type="button">필터 적용</button>
      <button className="ghostButton fullWidth" type="button">초기화</button>
    </aside>
  );
}

function RoomCard({ room }: { room: (typeof rooms)[number] }) {
  return (
    <article className="roomCard">
      <div className="roomInfo">
        <div className="badgeRow">
          <Badge tone="gold">KR</Badge>
          <Badge tone={room.tierClass as "tierEmerald"}>{room.tier}</Badge>
          <Badge tone="green" dot>{room.status}</Badge>
          <Badge tone="purple">{room.fit}</Badge>
        </div>
        <h3>{room.title}</h3>
        <div className="metaTags">
          <Badge tone="gold">{room.purpose}</Badge>
          <Badge tone="blue">{room.discord}</Badge>
          <Badge tone="green">{room.availability}</Badge>
          {room.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="authorRow">
          <span className="avatar" />
          <span>
            <strong>{room.host}</strong>
            <small>{room.hostMeta}</small>
          </span>
        </div>
      </div>
      <div className="roomAction">
        <button className="goldButton" type="button">신청하기</button>
      </div>
    </article>
  );
}

function PanelList({
  title,
  meta,
  rows
}: {
  title: string;
  meta: string;
  rows: string[][];
}) {
  return (
    <section className="railPanel">
      <div className="panelTitleRow">
        <h2>{title}</h2>
        <span>{meta}</span>
      </div>
      <div className="divider" />
      <div className="panelRows">
        {rows.map(([rowTitle, rowMeta], index) => (
          <div className="panelRow" key={rowTitle}>
            <Badge tone="gold">{index + 1}</Badge>
            <span>
              <strong>{rowTitle}</strong>
              <small>{rowMeta}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RightRail() {
  return (
    <aside className="rightRail" aria-label="내 신청 상태와 공지">
      <section className="comingSoon">
        <h2>준비중입니다.</h2>
        <p>MVP에서는 아직 제공하지 않는 기능입니다.</p>
        <p>지금은 모집방에서 바로 가능한 파트너를 찾아보세요.</p>
      </section>
      <PanelList title="최근 모집방" meta="실시간" rows={recentRows} />
      <PanelList title="내 신청 상태" meta="3건" rows={requestRows} />
      <PanelList title="서비스 공지" meta="MVP" rows={noticeRows} />
    </aside>
  );
}

function DesktopBoard() {
  return (
    <div className="desktopBoard">
      <ServiceBar />
      <MainNav />
      <SearchBar />
      <h1 className="srOnly">더블업 팀원찾기</h1>
      <section className="contentGrid">
        <FilterSidebar />
        <main className="mainColumn">
          <div className="sectionTitle">
            <h2>지금 모집 중인 파트너</h2>
            <span>모집중 128</span>
          </div>
          <div className="roomList">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </main>
        <RightRail />
      </section>
    </div>
  );
}

function MobileBoard() {
  return (
    <main className="mobileBoard">
      <header className="mobileTop">
        <strong className="brand">DOUBLEUP.GG</strong>
        <button className="goldButton" type="button">로그인</button>
      </header>
      <h1 className="srOnly">더블업 팀원찾기</h1>
      <label className="mobileSearch">
        <span className="srOnly">키워드 검색</span>
        <input placeholder="키워드 검색" type="search" />
      </label>
      <div className="mobileFilters" aria-label="필터 요약">
        {["KR 고정", "지금 가능", "티어 전체", "디스코드"].map((filter) => (
          <Badge key={filter}>{filter}</Badge>
        ))}
      </div>
      <section className="mobileList" aria-label="지금 모집 중인 파트너">
        {rooms.slice(0, 3).map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </section>
      <div className="bottomActionBar">
        <button className="ghostButton" type="button">필터</button>
        <button className="goldButton" type="button">방 만들기</button>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <>
      <DesktopBoard />
      <MobileBoard />
    </>
  );
}
