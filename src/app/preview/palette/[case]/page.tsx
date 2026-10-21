import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findCaperFixture } from "@/entities/caper/fixtures";
import { CaperPage } from "@/views/caper";
import { PaletteFrame, PreviewCasePage } from "@/views/preview";

import { findPreviewFamily } from "../../preview-families";
import { findPaletteCase, PALETTE_CASES } from "./cases";

// 케이스마다 내용이 통째로 다르고 개발용 화면이라, 앱 껍데기를 먼저 보여 주지 않고 이동을 잠깐 막는다.
export const instant = false;

export function generateStaticParams() {
  return PALETTE_CASES.map((previewCase) => ({ case: previewCase.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/palette/[case]">): Promise<Metadata> {
  const previewCase = findPaletteCase((await params).case);
  return {
    title: previewCase ? `${previewCase.label} · 글자색 비교` : "미리보기",
  };
}

export default async function PalettePreviewRoute({
  params,
}: PageProps<"/preview/palette/[case]">) {
  const previewCase = findPaletteCase((await params).case);
  const caper = findCaperFixture("to-the-moon")?.caper;
  if (previewCase === undefined || caper === undefined) notFound();

  return (
    <PreviewCasePage
      family={findPreviewFamily("palette")}
      previewCase={previewCase}
    >
      <PaletteFrame tokens={previewCase.tokens}>
        <CaperPage caper={caper} />
      </PaletteFrame>
    </PreviewCasePage>
  );
}
