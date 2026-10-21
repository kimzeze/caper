import { clsx } from "clsx";
import Link from "next/link";

import type { Caper } from "@/entities/caper";
import CopyLinkButton from "@/shared/ui/copy-link-button";

// 글 머리: 카테고리 → 제목 → 슬로건 → 부제.
// 제목을 표지 위에 얹었으면(titleOnCover) 폰에서는 카테고리와 제목을 표지가 그리므로 여기서 감추고,
// 넓은 화면에서는 표지 위 제목을 감추므로 제목을 여기서 그대로 보인다(모든 프로젝트가 같은 배치).
// 넓은 화면에서는 카테고리를 왼쪽 정보 표 첫 칸이 보여 주므로 여기서는 늘 감춘다.
// share 면 오른쪽에 링크 복사 버튼(mangrove 글처럼 글 머리 옆, 아래쪽 맞춤).
export function CaperHeading({
  caper,
  titleOnCover,
  categoryName,
  categoryHref,
  share,
  className,
}: {
  caper: Caper;
  /** 제목을 표지 위에 얹었는지(사진이 있을 때만). */
  titleOnCover: boolean;
  /** 제목 위 한 줄(잡지의 섹션 이름처럼). */
  categoryName?: string;
  /** 카테고리 모아 보기 주소. 있으면 카테고리 이름이 링크가 된다. */
  categoryHref?: string;
  /** 링크 복사 버튼을 둔다(저장된 프로젝트만. 만들기 미리보기는 나눌 주소가 없다). */
  share?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-end gap-4", className)}>
      <div className="min-w-0 flex-1">
        {!titleOnCover && categoryName && (
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
        <h1
          className={clsx(
            "whitespace-pre-line",
            titleOnCover ? "hidden lg:block" : categoryName && "mt-[0.25rlh]",
            "lg:mt-0",
          )}
        >
          {caper.title}
        </h1>
        {caper.slogan && (
          <p
            className={clsx(
              "font-bold",
              titleOnCover ? "lg:mt-[0.5rlh]" : "mt-[0.5rlh]",
            )}
          >
            {caper.slogan}
          </p>
        )}
        {caper.subtitle && (
          <p
            className={clsx(
              "text-muted-foreground",
              !caper.slogan &&
                (titleOnCover ? "lg:mt-[0.5rlh]" : "mt-[0.5rlh]"),
            )}
          >
            {caper.subtitle}
          </p>
        )}
      </div>
      {share && <CopyLinkButton className="shrink-0" />}
    </div>
  );
}
