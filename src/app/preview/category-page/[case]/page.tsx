import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage } from "@/views/category";
import { PreviewCasePage } from "@/views/preview";

import { findPreviewFamily } from "../../preview-families";
import { CATEGORY_PAGE_CASES, findCategoryPageCase } from "./cases";

// 케이스마다 내용이 통째로 다르고 개발용 화면이라, 앱 껍데기를 먼저 보여 주지 않고 이동을 잠깐 막는다.
export const instant = false;

export function generateStaticParams() {
  return CATEGORY_PAGE_CASES.map((previewCase) => ({ case: previewCase.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/preview/category-page/[case]">): Promise<Metadata> {
  const previewCase = findCategoryPageCase((await params).case);
  return {
    title: previewCase ? `${previewCase.label} · 카테고리` : "미리보기",
  };
}

export default async function CategoryPagePreviewRoute({
  params,
}: PageProps<"/preview/category-page/[case]">) {
  const previewCase = findCategoryPageCase((await params).case);
  if (previewCase === undefined) notFound();

  return (
    <PreviewCasePage
      family={findPreviewFamily("category-page")}
      previewCase={previewCase}
    >
      <CategoryPage
        category={previewCase.category}
        capers={previewCase.capers}
      />
    </PreviewCasePage>
  );
}
