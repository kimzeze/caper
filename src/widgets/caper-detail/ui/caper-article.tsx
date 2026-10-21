import { clsx } from "clsx";
import type { ReactNode } from "react";

import { type Caper, isTitleOverCover } from "@/entities/caper";

import { CaperBody } from "./caper-body";
import { CaperGallery, type GalleryPhoto } from "./caper-gallery";
import { CaperHeading } from "./caper-heading";
import { CaperInfo } from "./caper-info";

// 프로젝트 글 한 편의 배치. 프로젝트 페이지와 만들기 미리보기가 같이 쓴다.
// - 폰: 사진 넘기기(화면 폭) → 글 머리 → 글 몸, 한 단.
// - 넓은 화면(lg): 바깥 폭 --wide 에 왼쪽 정보 표(--aside, 스크롤을 따라옴) + 오른쪽 본문(--measure).
//   오른쪽은 글 머리 → 사진 → 글 몸(eyesmag 글처럼 제목이 먼저).
// 문서 순서는 글 머리가 먼저이고(화면 읽기도 제목부터), 폰에서만 사진을 앞으로 보인다(order).
// 제목을 표지 위에 얹었으면 어디서나 사진이 먼저다.
// 글은 폰에서 본문 폭(measure-col), 넓은 화면에서는 오른쪽 칸을 그대로 채운다.
// flex 칸 안에서 measure-col(margin auto)이 내용 폭으로 줄지 않게 칸마다 블록으로 한 번 감싼다.
const COLUMN = "measure-col lg:max-w-none lg:px-0";

export function CaperArticle({
  caper,
  photos,
  categoryName,
  categoryHref,
  myCrewId,
  withFooter,
}: {
  caper: Caper;
  /** 사진 주소는 쓰는 쪽이 정한다: 저장된 caper 는 imageUrl, 만들기 미리보기는 브라우저의 임시 사진. */
  photos: readonly GalleryPhoto[];
  categoryName?: string;
  categoryHref?: string;
  myCrewId?: string;
  withFooter?: ReactNode;
}) {
  const titleOver = isTitleOverCover(caper);
  const hasPhotos = photos.length > 0;

  return (
    <div className="lg:wide-col lg:mt-[1rlh] lg:grid lg:grid-cols-[var(--aside)_minmax(0,var(--measure))] lg:justify-between lg:gap-x-(--aside-gap)">
      <aside className="hidden lg:block">
        <CaperInfo
          caper={caper}
          categoryName={categoryName}
          categoryHref={categoryHref}
          className="sticky top-[1rlh]"
        />
      </aside>
      <main className="flex flex-col">
        <div
          className={clsx(
            "order-2",
            hasPhotos ? "mt-[1rlh]" : "mt-[2rlh]",
            titleOver ? "lg:mt-[1rlh]" : "lg:order-1 lg:mt-0",
          )}
        >
          <CaperHeading
            caper={caper}
            showTitle={!titleOver}
            categoryName={categoryName}
            categoryHref={categoryHref}
            className={COLUMN}
          />
        </div>
        {hasPhotos && (
          <div
            className={clsx(
              "order-1 mt-[0.5rlh] lg:mt-0",
              !titleOver && "lg:order-2 lg:mt-[1rlh]",
            )}
          >
            <CaperGallery
              photos={photos}
              title={caper.title}
              coverTitle={titleOver ? caper.title : undefined}
              coverKicker={titleOver ? categoryName : undefined}
              coverKickerHref={categoryHref}
              coverShade={caper.coverShade}
            />
          </div>
        )}
        <div className="order-3">
          <CaperBody
            caper={caper}
            myCrewId={myCrewId}
            withFooter={withFooter}
            className={COLUMN}
          />
        </div>
      </main>
    </div>
  );
}
