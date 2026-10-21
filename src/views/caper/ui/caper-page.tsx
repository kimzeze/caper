import {
  type Caper,
  type CaperViewer,
  imageUrl,
  isTitleOverCover,
} from "@/entities/caper";
import { type JoinActions, JoinBar } from "@/features/join-caper";
import { CaperDetail } from "@/widgets/caper-detail";
import { CaperGallery } from "@/widgets/caper-gallery";
import { SiteHeader } from "@/widgets/site-header";

// 프로젝트 페이지: 헤더 → 사진 넘기기(첫 장이 표지) → 내용 → 아래에 붙는 참여 줄.
// 제목은 작성자가 고른 대로 표지 위에 얹거나 사진 아래에 둔다.
// join 이 없으면(만들기 미리보기 등) 참여 줄을 그리지 않는다.
export function CaperPage({
  caper,
  join,
}: {
  caper: Caper;
  join?: { viewer: CaperViewer } & JoinActions;
}) {
  const viewer = join?.viewer;
  const titleOver = isTitleOverCover(caper);
  const hasImages = caper.images.length > 0;

  return (
    <>
      <SiteHeader />
      <main>
        {hasImages && (
          <div className="mt-[0.5rlh]">
            <CaperGallery
              photos={caper.images.map((image, index) => ({
                key: `${image.path}-${index}`,
                src: imageUrl(image),
              }))}
              title={caper.title}
              coverTitle={titleOver ? caper.title : undefined}
            />
          </div>
        )}
        <CaperDetail
          caper={caper}
          showTitle={!titleOver}
          myCrewId={
            viewer?.role === "member" || viewer?.role === "owner"
              ? viewer.crewId
              : undefined
          }
          className={hasImages ? "mt-[1rlh]" : "mt-[2rlh]"}
        />
      </main>
      {join && <JoinBar caper={caper} {...join} />}
    </>
  );
}
