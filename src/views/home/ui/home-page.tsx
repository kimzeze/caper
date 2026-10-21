import ButtonLink from "@/shared/ui/button-link";
import { SiteHeader } from "@/widgets/site-header";

// 첫 화면 자리. 프로젝트 목록은 목록 디자인 이슈에서 이 자리에 만든다.
// 넓은 화면에서는 헤더와 같은 바깥 폭에 두고, 글은 본문 폭까지만.
export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="measure-col mt-[3rlh] pb-[5rlh] lg:wide-col">
        <p className="font-mono text-base text-muted-foreground">
          Project Caper
        </p>
        <h1 className="mt-[0.25rlh]">평범한 계획을 한 편의 영화로</h1>
        <p className="mt-[1rlh] max-w-(--measure)">
          친구랑 물로켓 만들기 같은 계획에 영화 제목 같은 이름을 붙이고,
          포스터를 만들고, 함께할 사람을 모아 해 보고, 남깁니다.
        </p>
        <p className="mt-[1.5rlh]">
          <ButtonLink href="/new" variant="primary">
            새 프로젝트
          </ButtonLink>
        </p>
      </main>
    </>
  );
}
