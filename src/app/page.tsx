"use client";

import { useEffect, useMemo, useState } from "react";

type Program = { id: string; category: string; org: string; title: string; desc: string; amount: string; deadline: string; tag: string; link: string };
const categoryColors: Record<string, string> = { 사업화: "mint", "R&D": "lavender", 정책자금: "yellow", 인력: "peach", 수출: "blue", 전체: "mint" };
const categories = ["전체", "사업화", "R&D", "정책자금", "인력", "수출"];

export default function Home() {
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    fetch("/api/programs").then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "공고를 불러오지 못했습니다.");
      setPrograms(payload.programs);
    }).catch((error: Error) => setLoadError(error.message));
  }, []);
  const visible = useMemo(() => programs.filter((p) => (category === "전체" || p.category === category) && `${p.title} ${p.org} ${p.tag}`.toLowerCase().includes(query.toLowerCase())), [programs, category, query]);
  const toggleSaved = (id: string) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  return <main className="grant-site">
    <header className="topbar"><a className="brand" href="#home"><span className="brand-icon">돋</span><span>모아봄<small>사업 기회를 한눈에</small></span></a><nav><a href="#programs">지원사업</a><a href="#guide">이용방법</a><a href="#newsletter">소식받기</a></nav><a className="top-action" href="#programs">사업 찾기 <span>↗</span></a></header>
    <section className="hero" id="home"><div className="hero-copy"><span className="pill"><i /> 2026 지원사업 큐레이션</span><h1>놓치기 아까운<br />사업 기회, <em>모아봄.</em></h1><p>정부와 공공기관의 지원사업을 한곳에서 찾고,<br />내 사업에 꼭 맞는 기회를 발견해 보세요.</p><a className="hero-button" href="#programs">지금 사업 찾아보기 <span>↓</span></a><div className="hero-note"><b>매일 업데이트</b><span>창업부터 수출까지, 필요한 정보만 쏙쏙</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-sun">봄</div><div className="art-card card-back"><span>이번 달 지원사업</span><b>마감 임박</b><i>03</i></div><div className="art-card card-front"><span className="mini-icon">✳</span><div><b>내 사업의 다음 기회</b><small>맞춤 사업을 찾아보세요</small></div><span className="arrow">↗</span></div><span className="spark spark-a">✳</span><span className="spark spark-b">✳</span><span className="art-caption">FIND YOUR NEXT STEP</span></div><div className="hero-bottom"><span>사업의 시작부터 성장까지</span><span>SCROLL TO EXPLORE ↓</span></div></section>
    <section className="stats"><div><strong>한곳에서</strong><span>흩어진 지원정보를 모아</span></div><div><strong>쉽고 빠르게</strong><span>찾고 싶은 사업을 검색</span></div><div><strong>내게 맞게</strong><span>분야별로 한눈에 비교</span></div></section>
    <section className="programs" id="programs"><div className="section-heading"><div><span className="eyebrow">YOUR NEXT OPPORTUNITY</span><h2>지금 주목할 지원사업</h2><p>관심 분야를 골라 나에게 맞는 사업을 찾아보세요.</p></div><a className="all-link" href="#program-list">전체 사업 보기 <span>↗</span></a></div><div className="filters"><div className="tabs" role="tablist" aria-label="지원 분야">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="사업명, 기관, 키워드 검색"/><kbd>⌘ K</kbd></label></div><div className="program-grid" id="program-list">{visible.map((item) => <article className="program-card" key={item.id}><div className="card-top"><span className={`category ${categoryColors[item.category] ?? "mint"}`}>{item.category}</span><button className={`save ${saved.includes(item.id) ? "is-saved" : ""}`} aria-label={saved.includes(item.id) ? "관심사업 해제" : "관심사업 저장"} onClick={() => toggleSaved(item.id)}>{saved.includes(item.id) ? "♥" : "♡"}</button></div><small className="organization">{item.org}</small><h3>{item.title}</h3><p className="program-desc">{item.desc}</p><div className="card-meta"><span>{item.tag}</span><span>신청 기간 <b>{item.deadline}</b></span></div><div className="card-bottom"><div><small>지원 내용</small><strong>{item.amount}</strong></div><a href={item.link} target="_blank" rel="noreferrer">공식 공고 보기 <span>↗</span></a></div></article>)}</div>{loadError ? <div className="empty">공고를 불러오지 못했어요. {loadError}</div> : visible.length === 0 && <div className="empty">{programs.length === 0 ? "공식 공고를 불러오는 중입니다…" : "검색 결과가 없어요. 다른 키워드로 찾아보세요."}</div>}<p className="data-note">기업마당 지원사업정보 API 제공 데이터입니다. 신청 가능 여부와 세부 조건은 공식 공고에서 확인해 주세요.</p></section>
    <section className="guide" id="guide"><div className="guide-intro"><span className="eyebrow">HOW IT WORKS</span><h2>필요한 사업을<br /><em>더 쉽게.</em></h2><p>복잡한 공고 탐색은 가볍게,<br />좋은 기회에 집중할 수 있도록.</p></div><div className="guide-steps"><article><span>01</span><div><b>관심 분야를 선택해요</b><p>사업화, R&D, 정책자금 등 분야별로 살펴보세요.</p></div><i>↗</i></article><article><span>02</span><div><b>조건과 마감일을 확인해요</b><p>지원 대상과 주요 조건을 빠르게 비교할 수 있어요.</p></div><i>↗</i></article><article><span>03</span><div><b>공식 공고에서 신청해요</b><p>기관의 최신 공고를 확인하고 신청을 진행하세요.</p></div><i>↗</i></article></div></section>
    <section className="newsletter" id="newsletter"><div><span className="eyebrow">GOOD NEWS, IN YOUR INBOX</span><h2>새로운 기회를<br />놓치지 않도록.</h2><p>모아봄과 함께 지원사업 소식을 확인하세요.</p></div><a href="https://www.bizinfo.go.kr/" target="_blank" rel="noreferrer" className="newsletter-button">기업마당에서 더 보기 <span>↗</span></a></section>
    <footer><a className="brand footer-brand" href="#home"><span className="brand-icon">돋</span><span>모아봄<small>사업 기회를 한눈에</small></span></a><p>정부·공공기관 지원사업 탐색 서비스</p><small>© 2026 모아봄. 공고 정보는 각 주관기관을 통해 확인해 주세요.</small></footer>
  </main>;
}
