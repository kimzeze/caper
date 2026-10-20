import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isPreviewOpen } from "@/shared/config/preview";

// 미리보기는 고정 데이터만 그리므로 전부 정적이어야 한다. 빌드 때 만들지 않은 케이스 주소도
// 정적 결과가 나올 때까지 기다려, 없는 케이스는 앱 껍데기(200) 대신 404로 응답한다.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "화면 미리보기",
  robots: { index: false, follow: false },
};

// production 배포에서는 /preview 아래 전부를 404로 닫는다.
export default function PreviewLayout({ children }: LayoutProps<"/preview">) {
  if (!isPreviewOpen()) notFound();
  return children;
}
