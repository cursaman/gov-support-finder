import { NextResponse } from "next/server";

export const revalidate = 1800;

type BizInfoItem = {
  title?: string;
  pblancNm?: string;
  link?: string;
  pblancUrl?: string;
  author?: string;
  jrsdInsttNm?: string;
  description?: string;
  bsnsSumryCn?: string;
  lcategory?: string;
  pldirSportRealmLclasCodeNm?: string;
  reqstDt?: string;
  reqstBeginEndDe?: string;
  hashTags?: string;
  trgetNm?: string;
  pblancId?: string;
  seq?: string;
};

function categoryFor(item: BizInfoItem) {
  const text = `${item.lcategory ?? ""} ${item.pldirSportRealmLclasCodeNm ?? ""} ${item.hashTags ?? ""} ${item.title ?? item.pblancNm ?? ""}`;
  if (/기술|R&D|연구개발/i.test(text)) return "R&D";
  if (/수출|해외|글로벌/i.test(text)) return "수출";
  if (/인력|고용|채용/i.test(text)) return "인력";
  if (/금융|융자|자금/i.test(text)) return "정책자금";
  if (/창업|사업화|내수|경영/i.test(text)) return "사업화";
  return "전체";
}

export async function GET() {
  const key = process.env.BIZINFO_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "기업마당 API 인증키가 설정되지 않았습니다." }, { status: 503 });
  }

  const url = new URL("https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do");
  url.searchParams.set("crtfcKey", key);
  url.searchParams.set("dataType", "json");
  url.searchParams.set("searchCnt", "100");

  try {
    const response = await fetch(url, { next: { revalidate } });
    if (!response.ok) {
      return NextResponse.json({ error: "기업마당 공고를 불러오지 못했습니다." }, { status: 502 });
    }
    const payload = await response.json();
    const rawItems = payload?.jsonArray?.item ?? payload?.item ?? [];
    const items: BizInfoItem[] = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const programs = items.map((item) => {
      const title = item.pblancNm ?? item.title ?? "제목 미등록 공고";
      return {
        id: item.pblancId ?? item.seq ?? title,
        category: categoryFor(item),
        org: item.jrsdInsttNm ?? item.author ?? "주관기관 정보 없음",
        title,
        desc: (item.bsnsSumryCn ?? item.description ?? "공고문에서 지원 내용을 확인해 주세요.").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
        amount: "공고문에서 확인",
        deadline: item.reqstBeginEndDe ?? item.reqstDt ?? "공고문 확인",
        tag: item.trgetNm ?? item.hashTags?.split(",").slice(0, 2).join(" · ") ?? "지원사업",
        link: item.pblancUrl ?? item.link ?? "https://www.bizinfo.go.kr/",
      };
    });
    return NextResponse.json({ programs, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "기업마당 응답을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
