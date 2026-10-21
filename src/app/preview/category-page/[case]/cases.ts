import { CAPER_FIXTURES } from "@/entities/caper/fixtures";
import { type Category, categorySchema } from "@/entities/category";
import { findCategoryFixture } from "@/entities/category/fixtures";
import type { PreviewCase } from "@/views/preview";
import type { GridCaper } from "@/widgets/caper-grid";

const categoryOf = (id: string): Category => {
  const category = findCategoryFixture(id);
  if (category === undefined) throw new Error(`Unknown category: ${id}`);
  return category;
};

// 그 카테고리의 고정 데이터 프로젝트. 같은 프로젝트를 여러 케이스로 그린 것(제목 위치 등)은 한 번만 넣고,
// 카드는 그 프로젝트의 첫 케이스 미리보기로 간다.
const capersIn = (categoryId: string): GridCaper[] => {
  const seen = new Set<string>();
  return CAPER_FIXTURES.flatMap(({ key, caper }) => {
    if (caper.categoryId !== categoryId || seen.has(caper.id)) return [];
    seen.add(caper.id);
    return [{ caper, href: `/preview/caper-page/${key}` }];
  });
};

/** 카테고리 모아 보기 미리보기 케이스. */
export const CATEGORY_PAGE_CASES: readonly (PreviewCase & {
  category: Category;
  capers: readonly GridCaper[];
})[] = [
  {
    key: "many",
    label: "여러 개",
    note: "물로켓 시리즈 넷: 사진 있음·없음(글 포스터), 제목 줄 바꿈, 긴 제목, 완료. 새로 만든 것부터",
    category: categoryOf("water-rocket"),
    capers: capersIn("water-rocket"),
  },
  {
    key: "one",
    label: "하나, 긴 이름",
    note: "이름이 한도(20자)인 카테고리에 프로젝트 하나",
    category: categoryOf("long-name"),
    capers: capersIn("long-name"),
  },
  {
    key: "empty",
    label: "빈 카테고리",
    note: "막 만들어 아직 넣은 프로젝트가 없는 카테고리",
    category: categorySchema.parse({ id: "empty", name: "아직 빈 카테고리" }),
    capers: [],
  },
];

export function findCategoryPageCase(key: string) {
  return CATEGORY_PAGE_CASES.find((previewCase) => previewCase.key === key);
}

/** 프로젝트 페이지 미리보기에서 카테고리 이름이 갈 곳. 그 카테고리의 모아 보기 케이스가 있을 때만. */
export function categoryPageHref(
  categoryId: string | undefined,
): string | undefined {
  const previewCase = CATEGORY_PAGE_CASES.find(
    ({ category }) => category.id === categoryId,
  );
  return previewCase && `/preview/category-page/${previewCase.key}`;
}
