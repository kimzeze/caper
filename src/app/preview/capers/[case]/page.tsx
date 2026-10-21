import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CAPER_FIXTURES, findCaperFixture } from "@/entities/caper/fixtures";
import { findCategoryFixture } from "@/entities/category/fixtures";
import { CaperDataView, PreviewCasePage } from "@/views/preview";

import { findPreviewFamily } from "../../preview-families";

// 케이스마다 내용이 통째로 다르고 개발용 화면이라, 앱 껍데기를 먼저 보여 주지 않고 이동을 잠깐 막는다.
// 사용자 화면은 같은 크기의 자리를 먼저 그리는 Suspense 쪽으로 간다.
export const instant = false;

export function generateStaticParams() {
  return CAPER_FIXTURES.map((fixture) => ({ case: fixture.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/capers/[case]">): Promise<Metadata> {
  const fixture = findCaperFixture((await params).case);
  return { title: fixture ? `${fixture.label} · 미리보기` : "미리보기" };
}

export default async function CaperDataPreviewRoute({
  params,
}: PageProps<"/preview/capers/[case]">) {
  const fixture = findCaperFixture((await params).case);
  if (fixture === undefined) notFound();

  return (
    <PreviewCasePage family={findPreviewFamily("capers")} previewCase={fixture}>
      <CaperDataView
        caper={fixture.caper}
        category={findCategoryFixture(fixture.caper.categoryId)}
      />
    </PreviewCasePage>
  );
}
