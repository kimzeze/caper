import {
  type Caper,
  type CaperViewer,
  imageUrl,
  type JoinRequest,
} from "@/entities/caper";
import type { Category } from "@/entities/category";
import { type JoinActions, JoinBar } from "@/features/join-caper";
import {
  JoinRequests,
  RequestsBar,
  type ReviewActions,
} from "@/features/review-join-requests";
import { CaperArticle } from "@/widgets/caper-detail";
import { SiteHeader } from "@/widgets/site-header";

// 프로젝트 페이지: 헤더 → 글(CaperArticle: 폰은 사진 → 제목 → 본문, 넓은 화면은 왼쪽 정보 표 + 오른쪽 제목 → 사진 → 본문)
// → 아래에 붙는 참여 줄. 카테고리(category)는 제목 바로 위 한 줄과 정보 표 첫 칸.
// join 이 없으면(만들기 미리보기 등) 참여 줄을 그리지 않는다.
// review 는 만든 사람에게만 준다: with 구역 끝에 승인 목록, 아래 줄에 기다리는 사람 수.
export function CaperPage({
  caper,
  category,
  categoryHref,
  join,
  review,
}: {
  caper: Caper;
  category?: Category;
  /** 카테고리 모아 보기 주소. 있으면 제목 위 카테고리 이름이 링크가 된다. */
  categoryHref?: string;
  join?: { viewer: CaperViewer } & JoinActions;
  review?: { requests: readonly JoinRequest[] } & ReviewActions;
}) {
  const viewer = join?.viewer;

  return (
    <>
      <SiteHeader />
      <CaperArticle
        caper={caper}
        photos={caper.images.map((image, index) => ({
          key: `${image.path}-${index}`,
          src: imageUrl(image),
        }))}
        categoryName={category?.name}
        categoryHref={categoryHref}
        myCrewId={
          viewer?.role === "member" || viewer?.role === "owner"
            ? viewer.crewId
            : undefined
        }
        withFooter={review && <JoinRequests caper={caper} {...review} />}
      />
      {join && <JoinBar caper={caper} {...join} />}
      {review && <RequestsBar count={review.requests.length} />}
    </>
  );
}
