"use client";

import Link from "next/link";

import { isTitleOverCover } from "@/entities/caper";
import { toPreviewCaper, useLoadedDraft } from "@/features/create-caper";
import { CaperDetail } from "@/widgets/caper-detail";
import { CaperGallery } from "@/widgets/caper-gallery";
import { SiteHeader } from "@/widgets/site-header";

// 만들기를 누른 뒤의 미리보기. 아직 DB가 없어 초안을 프로젝트 페이지 모양으로만 보여 준다.
// 구성은 views/caper 의 CaperPage 와 같다(같은 층의 view 는 서로 import하지 않아 여기서 다시 묶는다).
export function NewCaperPreviewPage() {
  const draft = useLoadedDraft();
  const caper = draft === undefined ? undefined : toPreviewCaper(draft);

  return (
    <>
      <SiteHeader />
      <p className="measure-col mt-[0.5rlh] text-base text-muted-foreground">
        아직 저장되지 않는 미리보기입니다. <Link href="/new">고치기</Link>
      </p>
      {draft === undefined ? null : caper === undefined ? (
        <main className="measure-col mt-[2rlh] pb-[5rlh]">
          <p>만들 내용이 없습니다.</p>
          <p className="mt-[0.5rlh]">
            <Link href="/new">새 프로젝트 쓰기</Link>
          </p>
        </main>
      ) : (
        <main>
          {caper.images.length > 0 && (
            <div className="mt-[0.5rlh]">
              <CaperGallery
                images={caper.images}
                title={caper.title}
                coverTitle={isTitleOverCover(caper) ? caper.title : undefined}
              />
            </div>
          )}
          <CaperDetail
            caper={caper}
            showTitle={!isTitleOverCover(caper)}
            className={caper.images.length > 0 ? "mt-[1rlh]" : "mt-[2rlh]"}
          />
        </main>
      )}
    </>
  );
}
