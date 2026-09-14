import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Git Signal — AI 오픈소스의 다음 흐름", template: "%s · Git Signal" },
  description: "주목받는 AI 오픈소스, 최신 릴리스와 연구 논문을 한곳에서. 프로젝트의 성장과 그 배경을 함께 탐색하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><a className="skip-link" href="#main">본문으로 이동</a><Header />{children}<Footer /></body></html>;
}
