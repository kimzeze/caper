import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaperEditorPreview } from "@/features/create-caper/preview";
import { PreviewCasePage } from "@/views/preview";

import { findPreviewFamily } from "../../preview-families";
import { findNewCaperCase, NEW_CAPER_CASES } from "./cases";

// 케이스마다 내용이 통째로 다르고 개발용 화면이라, 앱 껍데기를 먼저 보여 주지 않고 이동을 잠깐 막는다.
export const instant = false;

export function generateStaticParams() {
  return NEW_CAPER_CASES.map((previewCase) => ({ case: previewCase.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/new-caper/[case]">): Promise<Metadata> {
  const previewCase = findNewCaperCase((await params).case);
  return {
    title: previewCase ? `${previewCase.label} · 만들기` : "미리보기",
  };
}

export default async function NewCaperPreviewRoute({
  params,
}: PageProps<"/preview/new-caper/[case]">) {
  const previewCase = findNewCaperCase((await params).case);
  if (previewCase === undefined) notFound();

  return (
    <PreviewCasePage
      family={findPreviewFamily("new-caper")}
      previewCase={previewCase}
    >
      <CaperEditorPreview
        defaultValues={previewCase.values}
        photos={previewCase.photos}
      />
    </PreviewCasePage>
  );
}
