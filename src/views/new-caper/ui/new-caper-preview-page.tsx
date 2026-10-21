"use client";

import Link from "next/link";

import {
  toPreviewCaper,
  useDraftPhotos,
  useDraftPhotoUrls,
  useLoadedDraft,
  useMyCategories,
} from "@/features/create-caper";
import { CaperArticle } from "@/widgets/caper-detail";
import { SiteHeader } from "@/widgets/site-header";

// 만들기를 누른 뒤의 미리보기. 아직 DB가 없어 초안을 프로젝트 페이지 모양으로만 보여 준다.
// 사진은 브라우저에 임시 저장한 사진(blob: 주소)으로 그린다.
// 글 배치는 프로젝트 페이지와 같은 CaperArticle 이다(참여 줄은 없다).
export function NewCaperPreviewPage() {
  const draft = useLoadedDraft();
  const photos = useDraftPhotos();
  const urls = useDraftPhotoUrls(photos);
  const categories = useMyCategories();
  const caper =
    draft === undefined || photos === undefined
      ? undefined
      : toPreviewCaper(draft, photos);
  const galleryPhotos = (photos ?? []).flatMap((photo) => {
    const src = urls[photo.id];
    return src === undefined ? [] : [{ key: photo.id, src }];
  });
  const categoryName = categories?.find(
    (category) => category.id === caper?.categoryId,
  )?.name;
  // 사진 주소를 다 만들기 전에는 사진 자리만 두지 않고 기다린다(장 수가 바뀌며 화면이 밀리지 않게).
  const photosReady = galleryPhotos.length === (photos?.length ?? 0);

  return (
    <>
      <SiteHeader />
      <p className="measure-col mt-[0.5rlh] text-base text-muted-foreground lg:wide-col">
        아직 저장되지 않는 미리보기입니다. <Link href="/new">고치기</Link>
      </p>
      {draft === undefined || photos === undefined ? null : caper ===
        undefined ? (
        <main className="measure-col mt-[2rlh] pb-[5rlh]">
          <p>만들 내용이 없습니다.</p>
          <p className="mt-[0.5rlh]">
            <Link href="/new">새 프로젝트 쓰기</Link>
          </p>
        </main>
      ) : !photosReady ? null : (
        <CaperArticle
          caper={caper}
          photos={galleryPhotos}
          categoryName={categoryName}
        />
      )}
    </>
  );
}
