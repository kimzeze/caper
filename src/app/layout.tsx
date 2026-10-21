import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { THEME_INIT } from "@/shared/ui/theme-store";

import "./globals.css";

// 본문 글꼴은 design-system-a와 같은 두 벌. next/font가 파일을 싣고 미리 불러오며, 대체 글꼴 크기를 맞춰 글이 밀리지 않게 한다.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "100 900",
  variable: "--font-pretendard",
  display: "swap",
});

// 고정폭은 날짜·숫자에만 써서 첫 화면에 거의 없다. 미리 불러오지 않는다.
const monoplex = localFont({
  src: "./fonts/MonoplexKR-Regular.woff2",
  weight: "400",
  variable: "--font-monoplex",
  display: "swap",
  preload: false,
});

// 로고(헤더의 caper)에만 쓰는 글꼴. Urbanist 굵기 400 한 벌만 뽑은 정적 파일이다(라틴, 12KB).
// 가변 글꼴 전체를 싣지 않으려고 Google Fonts 에서 이 값으로 잘라 받았다. 고른 과정은 docs/design/logo.md.
const logoFont = localFont({
  src: "./fonts/Urbanist-Regular.woff2",
  weight: "400",
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Project Caper", template: "%s · Caper" },
  description:
    "평범한 계획에 영화 제목 같은 이름을 붙여 하나의 프로젝트로 만듭니다.",
};

// 모바일 브라우저 주소창 색을 바탕색(theme.css 의 --color-background)에 맞춘다.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme 은 첫 페인트 전에 THEME_INIT 이 붙이므로 서버 HTML과 다를 수 있다.
    <html
      lang="ko"
      className={`${pretendard.variable} ${monoplex.variable} ${logoFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
