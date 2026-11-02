import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모아봄 | 정부 지원사업 한눈에 찾기",
  description: "정부와 공공기관의 지원사업을 한곳에서 검색하고 내 사업에 맞는 기회를 발견해 보세요."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
