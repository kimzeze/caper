import { clsx } from "clsx";
import type { ReactNode } from "react";

import { type Caper, isTitleOverCover } from "@/entities/caper";

import { CaperBody } from "./caper-body";
import { CaperGallery, type GalleryPhoto } from "./caper-gallery";
import { CaperHeading } from "./caper-heading";
import { CaperInfo } from "./caper-info";

// 프로젝트 글 한 편의 배치. 프로젝트 페이지와 만들기 미리보기가 같이 쓴다.
// - 폰: 사진 넘기기(화면 폭) → 글 머리 → 글 몸, 한 단.
// - 넓은 화면(lg): 바깥 폭 --wide 에 왼쪽 정보 표(--aside, 스크롤을 따라옴) + 오른쪽 본문(--article), article-grid.
//   오른쪽은 행 셋(글 머리 → 사진 → 글 몸, eyesmag 글처럼 제목이 먼저)이고, 정보 표는 둘째 행부터 시작해
//   제목 줄 수와 상관없이 늘 제목 묶음 바로 아래(사진 윗선 높이)에서 시작한다.
// 문서 순서는 글 머리가 먼저이고(화면 읽기도 제목부터), 폰에서만 사진을 앞으로 보인다(order).
// 제목을 표지 위에 얹었으면 폰은 표지가 제목을 그리고, 넓은 화면은 표지 위 제목을 감추고 글 머리에 그대로 둔다
// (넓은 화면 배치는 모든 프로젝트가 같다).
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
  shareable,
}: {
  caper: Caper;
  /** 사진 주소는 쓰는 쪽이 정한다: 저장된 caper 는 imageUrl, 만들기 미리보기는 브라우저의 임시 사진. */
  photos: readonly GalleryPhoto[];
  categoryName?: string;
  categoryHref?: string;
  myCrewId?: string;
  withFooter?: ReactNode;
  /** 글 머리 오른쪽에 링크 복사 버튼(저장된 프로젝트 페이지만). */
  shareable?: boolean;
}) {
  const titleOver = isTitleOverCover(caper);
  const hasPhotos = photos.length > 0;

  return (
    <main className="flex flex-col lg:wide-col lg:mt-[1rlh] lg:article-grid lg:grid-rows-[auto_auto_1fr]">
      <div
        className={clsx(
          "order-2 lg:col-start-2 lg:row-start-1 lg:mt-0",
          hasPhotos ? "mt-[1rlh]" : "mt-[2rlh]",
        )}
      >
        <CaperHeading
          caper={caper}
          titleOnCover={titleOver}
          categoryName={categoryName}
          categoryHref={categoryHref}
          share={shareable}
          className={COLUMN}
        />
      </div>
      {hasPhotos && (
        <div className="order-1 mt-[0.5rlh] lg:col-start-2 lg:row-start-2 lg:mt-[1rlh]">
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
      <div className="order-3 lg:col-start-2 lg:row-start-3">
        <CaperBody
          caper={caper}
          myCrewId={myCrewId}
          withFooter={withFooter}
          className={COLUMN}
        />
      </div>
      {/* 정보 표는 글 뒤(화면 읽기는 제목부터). 넓은 화면에서 둘째 행(글 머리 바로 아래)부터 끝까지 왼쪽 칸에 둔다. */}
      <aside
        className={clsx(
          "hidden lg:col-start-1 lg:row-span-2 lg:row-start-2 lg:block",
          hasPhotos ? "lg:mt-[1rlh]" : "lg:mt-[1.5rlh]",
        )}
      >
        <CaperInfo
          caper={caper}
          categoryName={categoryName}
          categoryHref={categoryHref}
          className="sticky top-[calc(var(--site-header)+1rlh)]"
        />
      </aside>
    </main>
  );
}
