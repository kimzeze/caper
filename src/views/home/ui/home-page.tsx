import ThemeToggle from "@/shared/ui/theme-toggle";

// 첫 화면 자리. 프로젝트 목록과 표지는 화면 디자인 이슈에서 이 자리에 만든다.
export function HomePage() {
  return (
    <>
      <header className="measure-col flex min-h-control items-center justify-between pt-[1.5rlh]">
        <span className="font-bold">Caper</span>
        {/* 아이콘 버튼의 안쪽 여백만큼 당겨 오른쪽 선을 글 폭에 맞춘다. */}
        <div className="-mr-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="measure-col mt-[3rlh] pb-[5rlh]">
        <p className="font-mono text-base text-muted-foreground">
          Project Caper
        </p>
        <h1 className="mt-[0.25rlh]">평범한 계획을 한 편의 영화로</h1>
        <p className="mt-[1rlh]">
          친구랑 물로켓 만들기 같은 계획에 영화 제목 같은 이름을 붙이고,
          포스터를 만들고, crew를 모아 해 보고, 남깁니다.
        </p>
        <p className="mt-[0.5rlh] text-muted-foreground">
          지금 만들고 있습니다.
        </p>
      </main>
    </>
  );
}
