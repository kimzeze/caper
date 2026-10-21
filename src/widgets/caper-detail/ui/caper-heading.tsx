import { clsx } from "clsx";
import Link from "next/link";

import type { Caper } from "@/entities/caper";

// 글 머리: 카테고리 → 제목 → 슬로건 → 부제. 제목을 표지 위에 얹었으면(showTitle 끔) 카테고리와 제목은 표지가 그린다.
// 넓은 화면에서는 카테고리를 왼쪽 정보 표 첫 칸이 보여 주므로 여기서는 감춘다.
export function CaperHeading({
  caper,
  showTitle,
  categoryName,
  categoryHref,
  className,
}: {
  caper: Caper;
  showTitle: boolean;
  /** 제목 위 한 줄(잡지의 섹션 이름처럼). */
  categoryName?: string;
  /** 카테고리 모아 보기 주소. 있으면 카테고리 이름이 링크가 된다. */
  categoryHref?: string;
  className?: string;
}) {
  if (!showTitle && !caper.slogan && !caper.subtitle) return null;

  return (
    <div className={className}>
      {showTitle && categoryName && (
        <p className="text-base text-muted-foreground lg:hidden">
          {categoryHref ? (
            <Link href={categoryHref} className="text-muted-foreground">
              {categoryName}
            </Link>
          ) : (
            categoryName
          )}
        </p>
      )}
      {showTitle && (
        <h1
          className={clsx(
            "whitespace-pre-line",
            categoryName && "mt-[0.25rlh] lg:mt-0",
          )}
        >
          {caper.title}
        </h1>
      )}
      {caper.slogan && (
        <p className={clsx("font-bold", showTitle && "mt-[0.5rlh]")}>
          {caper.slogan}
        </p>
      )}
      {caper.subtitle && (
        <p
          className={clsx(
            "text-muted-foreground",
            showTitle && !caper.slogan && "mt-[0.5rlh]",
          )}
        >
          {caper.subtitle}
        </p>
      )}
    </div>
  );
}
