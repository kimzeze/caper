import type { Category } from "@/entities/category";
import { CaperGrid, type GridCaper } from "@/widgets/caper-grid";
import { SiteHeader } from "@/widgets/site-header";

// 카테고리 모아 보기: 헤더 → "카테고리" 한 줄 + 이름 + 프로젝트 수 → 포스터 격자(새로 만든 것부터).
// 넓은 화면에서는 헤더와 같은 바깥 폭(wide-col)에 네 칸.
export function CategoryPage({
  category,
  capers,
}: {
  category: Category;
  capers: readonly GridCaper[];
}) {
  const newestFirst = [...capers].sort((a, b) =>
    b.caper.createdAt.localeCompare(a.caper.createdAt),
  );

  return (
    <>
      <SiteHeader />
      <main className="measure-col mt-[2rlh] pb-[5rlh] lg:wide-col">
        <p className="text-base text-muted-foreground">카테고리</p>
        <h1 className="mt-[0.25rlh]">{category.name}</h1>
        <p className="mt-[0.5rlh] text-base text-muted-foreground">
          프로젝트 {capers.length}개
        </p>
        {newestFirst.length === 0 ? (
          <p className="mt-[1.5rlh]">아직 이 카테고리에 프로젝트가 없습니다.</p>
        ) : (
          <CaperGrid
            items={newestFirst}
            className="mt-[1.5rlh] lg:grid-cols-4"
          />
        )}
      </main>
    </>
  );
}
