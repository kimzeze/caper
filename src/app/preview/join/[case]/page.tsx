import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PreviewCasePage } from "@/views/preview";

import { findPreviewFamily } from "../../preview-families";
import { findJoinCase, JOIN_CASES } from "./cases";
import { JoinPreview } from "./join-preview";

// 케이스마다 내용이 통째로 다르고 개발용 화면이라, 앱 껍데기를 먼저 보여 주지 않고 이동을 잠깐 막는다.
export const instant = false;

export function generateStaticParams() {
  return JOIN_CASES.map((previewCase) => ({ case: previewCase.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/join/[case]">): Promise<Metadata> {
  const previewCase = findJoinCase((await params).case);
  return {
    title: previewCase ? `${previewCase.label} · 참여하기` : "미리보기",
  };
}

export default async function JoinPreviewRoute({
  params,
}: PageProps<"/preview/join/[case]">) {
  const previewCase = findJoinCase((await params).case);
  if (previewCase === undefined) notFound();

  return (
    <PreviewCasePage
      family={findPreviewFamily("join")}
      previewCase={previewCase}
    >
      <JoinPreview
        caper={previewCase.caper}
        viewer={previewCase.viewer}
        requests={previewCase.requests}
      />
    </PreviewCasePage>
  );
}
