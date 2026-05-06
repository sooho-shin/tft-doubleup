import React from "react";
import Link from "next/link";

const similarRooms = [
  ["순방 위주로 침착하게 하실 분", "Diamond IV · 지금 가능"],
  ["초보 환영, 배치 같이 보기", "Platinum I · 바로 1판"],
  ["즐겜이지만 기본 운영 맞춰요", "Gold II · 듣기만 가능"]
];

function Badge({
  children,
  tone = "neutral",
  dot = false
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "green" | "blue" | "tierEmerald";
  dot?: boolean;
}) {
  return (
    <span className={`badge ${tone}`}>
      {dot ? <span className="dot" /> : null}
      {children}
    </span>
  );
}

function DetailNav() {
  return (
    <>
      <div className="serviceBar">
        <div className="serviceInner">
          <span>전략적 팀 전투</span>
          <span className="serviceActive">더블업 찾기</span>
          <span>전적검색</span>
          <span>메타</span>
          <span className="serviceMeta">KR 한국어 로그인</span>
        </div>
      </div>
      <nav className="mainNav" aria-label="주요 메뉴">
        <Link className="brandLink" href="/">DOUBLEUP.GG</Link>
        <div className="navItems">
          <Link className="navLink" href="/">팀원찾기</Link>
          <Link className="navLink" href="/">모집방</Link>
          <Link className="navLink muted" href="/">가이드</Link>
        </div>
        <div className="navActions">
          <button className="ghostButton" type="button">로그인</button>
          <button className="goldButton" type="button">방 만들기</button>
        </div>
      </nav>
    </>
  );
}

function DetailPanel({
  title,
  meta,
  children
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="detailPanel">
      <div className="panelTitleRow">
        <h2>{title}</h2>
        {meta ? <span>{meta}</span> : null}
      </div>
      {children}
    </section>
  );
}

export default function RecruitmentDetailPage() {
  return (
    <main className="detailPage">
      <DetailNav />
      <section className="detailGrid">
        <div className="detailMain">
          <article className="detailHero">
            <div className="badgeRow">
              <Badge tone="gold">KR</Badge>
              <Badge tone="tierEmerald">Emerald II</Badge>
              <Badge tone="green" dot>지금 가능</Badge>
            </div>
            <h1>랭크 같이 올릴 더블업 파트너 구합니다</h1>
            <div className="metaTags">
              <Badge tone="gold">랭크 상승</Badge>
              <Badge tone="blue">대화 가능</Badge>
              <Badge tone="green">바로 2판</Badge>
            </div>
          </article>

          <DetailPanel title="조건 요약" meta="MVP 필드">
            <dl className="conditionList">
              <div>
                <dt>티어 범위</dt>
                <dd>Platinum I - Diamond IV</dd>
              </div>
              <div>
                <dt>디스코드</dt>
                <dd>대화 가능</dd>
              </div>
              <div>
                <dt>플레이 스타일</dt>
                <dd>운영덱 · 소통 선호 · 템포 운영</dd>
              </div>
              <div>
                <dt>모집 상태</dt>
                <dd>모집중</dd>
              </div>
            </dl>
          </DetailPanel>

          <DetailPanel title="상세 설명">
            <p className="detailCopy">
              초반 운영과 아이템 방향을 같이 맞추면서 안정적으로 순방하고 싶습니다. 무리한 콜보다 서로 정보 공유하면서 랭크 올릴 분을 찾습니다.
            </p>
          </DetailPanel>
        </div>

        <aside className="detailAside" aria-label="모집 상세 보조 정보">
          <section className="profileSummary">
            <span className="avatar large" />
            <div>
              <strong>도전자연습생</strong>
              <small>Emerald II · 최근 활동 3분 전</small>
            </div>
            <Badge tone="gold">한국 서버 · KR 고정</Badge>
          </section>

          <section className="requestPanel">
            <h2>파트너 신청</h2>
            <label>
              <span className="srOnly">신청 메시지</span>
              <input placeholder="신청 메시지" />
            </label>
            <button className="goldButton fullWidth" type="button">신청하기</button>
          </section>

          <section className="railPanel">
            <div className="panelTitleRow">
              <h2>비슷한 모집방</h2>
              <span>3개</span>
            </div>
            <div className="divider" />
            {similarRooms.map(([title, meta], index) => (
              <div className="panelRow" key={title}>
                <Badge tone="gold">{index + 1}</Badge>
                <span>
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </span>
              </div>
            ))}
          </section>
        </aside>
      </section>
    </main>
  );
}
