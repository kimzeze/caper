import Link from "next/link";

import ScrollProgress from "@/shared/ui/scroll-progress";
import ThemeToggle from "@/shared/ui/theme-toggle";

// 모든 화면 맨 위 한 줄: 왼쪽에 로고, 오른쪽 끝에 테마 버튼(design-system-a의 서비스 헤더와 같은 자리).
// 로고는 로고 글꼴(Urbanist 400) 소문자 caper. 링크지만 올려도 반전하지 않는다(로고는 그대로 둔다).
// 스크롤해도 위에 붙어 있다(sticky). 높이는 --site-header 하나라 sticky 정보 표와 페이지 안 이동이 그만큼 비킨다.
// 폰은 아래에 아주 연한 선(옅은 바탕색), 넓은 화면은 선 없음. 아래 끝에 스크롤 진행 막대(화면 폭 전체).
// 넓은 화면에서는 2단 화면과 같은 바깥 폭(wide-col)에 맞춘다.
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-20 border-b border-muted bg-background lg:border-b-0">
      <header className="measure-col flex h-(--site-header) items-center justify-between lg:wide-col">
        <Link
          href="/"
          className="font-logo text-[2.25rem] leading-none font-normal tracking-[-0.01em] no-underline hover:bg-transparent hover:text-foreground"
        >
          caper
        </Link>
        {/* 아이콘 버튼의 안쪽 여백만큼 당겨 오른쪽 선을 글 폭에 맞춘다. */}
        <div className="-mr-2">
          <ThemeToggle />
        </div>
      </header>
      <ScrollProgress className="absolute inset-x-0 -bottom-px" />
    </div>
  );
}
