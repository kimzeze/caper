import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CAPER_FIXTURES, findCaperFixture } from "@/entities/caper/fixtures";
import { findCategoryFixture } from "@/entities/category/fixtures";
import { CaperPage } from "@/views/caper";
import { PreviewCasePage } from "@/views/preview";

import { findPreviewFamily } from "../../preview-families";

// 케이스마다 내용이 통째로 다르고 개발용 화면이라, 앱 껍데기를 먼저 보여 주지 않고 이동을 잠깐 막는다.
export const instant = false;

export function generateStaticParams() {
  return CAPER_FIXTURES.map((fixture) => ({ case: fixture.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/caper-page/[case]">): Promise<Metadata> {
  const fixture = findCaperFixture((await params).case);
  return {
    title: fixture ? `${fixture.label} · 프로젝트 페이지` : "미리보기",
  };
}

export default async function CaperPagePreviewRoute({
  params,
}: PageProps<"/preview/caper-page/[case]">) {
  const fixture = findCaperFixture((await params).case);
  if (fixture === undefined) notFound();

  return (
    <PreviewCasePage
      family={findPreviewFamily("caper-page")}
      previewCase={fixture}
    >
      <CaperPage
        caper={fixture.caper}
        category={findCategoryFixture(fixture.caper.categoryId)}
      />
    </PreviewCasePage>
  );
}
