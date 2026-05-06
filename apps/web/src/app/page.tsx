import React from "react";

const navItems = ["팀원찾기", "모집방", "가이드", "내 프로필", "로그인"];

const rooms = [
  {
    id: "room-emerald",
    tier: "Emerald II-Diamond IV",
    status: "지금 가능",
    title: "랭크 상승 파트너 구해요",
    meta: "대화 가능 · 순방 위주 · 바로 2판 가능",
    tags: ["운영덱", "소통 선호", "템포 운영"],
    host: "레벨업타이밍 · Emerald II"
  },
  {
    id: "room-platinum",
    tier: "Platinum I-Emerald IV",
    status: "바로 1판 가능",
    title: "순방 위주로 차분하게 하실 분",
    meta: "듣기만 가능 · 랭크 상승 · 지금 가능",
    tags: ["유연한 운영", "아이템 상담", "순방 위주"],
    host: "초밥집먼저감 · Platinum I"
  }
];

const filters = ["티어", "목적", "디스코드", "플레이 스타일", "지금 가능"];

export default function HomePage() {
  return (
    <main className="shell">
      <nav className="nav" aria-label="주요 메뉴">
        <strong className="brand">TFT Double Up</strong>
        <div className="navItems">
          {navItems.map((item) => (
            <button className="navButton" key={item} type="button">
              {item}
            </button>
          ))}
        </div>
        <button className="primaryAction" type="button">
          방 만들기
        </button>
      </nav>

      <section className="summary" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">KR 고정</p>
          <h1 id="page-title">더블업 팀원찾기</h1>
        </div>
        <dl className="metrics" aria-label="모집 현황">
          <div>
            <dt>모집중</dt>
            <dd>12</dd>
          </div>
          <div>
            <dt>지금 가능</dt>
            <dd>8</dd>
          </div>
          <div>
            <dt>내 신청</dt>
            <dd>2</dd>
          </div>
        </dl>
      </section>

      <section className="quickFilters" aria-label="검색과 빠른 필터">
        <label className="searchField">
          <span>키워드 검색</span>
          <input placeholder="티어, 목적, 방 제목" type="search" />
        </label>
        <div className="filterChips">
          {filters.map((filter) => (
            <button key={filter} type="button">
              {filter}
            </button>
          ))}
        </div>
      </section>

      <div className="board">
        <aside className="filterPanel" aria-label="상세 필터">
          <h2>상세 필터</h2>
          <div className="filterGroup">
            <span>한국 서버</span>
            <strong>KR</strong>
          </div>
          <div className="filterGroup">
            <span>모집 상태</span>
            <strong>모집중</strong>
          </div>
          <button className="secondaryAction" type="button">
            초기화
          </button>
        </aside>

        <section className="roomList" aria-labelledby="rooms-title">
          <div className="sectionHeader">
            <h2 id="rooms-title">지금 모집 중인 파트너</h2>
            <span>기본 목록</span>
          </div>
          {rooms.map((room) => (
            <article className="roomCard" key={room.id}>
              <p className="roomMeta">
                KR · {room.tier} · {room.status}
              </p>
              <h3>{room.title}</h3>
              <p>{room.meta}</p>
              <div className="tags" aria-label="플레이 스타일">
                {room.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <div className="cardFooter">
                <span>방장: {room.host}</span>
                <button type="button">신청하기</button>
              </div>
            </article>
          ))}
        </section>

        <aside className="sidePanel" aria-label="내 신청 상태와 공지">
          <section>
            <h2>내 신청 상태</h2>
            <p>아직 받은 신청이 없습니다.</p>
          </section>
          <section>
            <h2>서비스 공지</h2>
            <p>가이드는 준비중입니다.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
