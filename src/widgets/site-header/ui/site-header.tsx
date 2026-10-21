import Link from "next/link";

import ThemeToggle from "@/shared/ui/theme-toggle";

// 모든 화면 맨 위 한 줄: 왼쪽에 로고, 오른쪽 끝에 테마 버튼(design-system-a의 서비스 헤더와 같은 자리).
// 로고는 로고 글꼴(Archivo 폭 125%·900) 소문자 caper. 링크지만 올려도 반전하지 않는다(로고는 그대로 둔다).
// 위아래 여백은 좁게(0.5rlh) 둔다. 넓은 화면에서는 2단 화면과 같은 바깥 폭(wide-col)에 맞춘다.
export function SiteHeader() {
  return (
    <header className="measure-col flex min-h-control items-center justify-between py-[0.5rlh] lg:wide-col">
      <Link
        href="/"
        className="font-logo text-[2rem] leading-none font-black tracking-[-0.02em] no-underline hover:bg-transparent hover:text-foreground"
      >
        caper
      </Link>
      {/* 아이콘 버튼의 안쪽 여백만큼 당겨 오른쪽 선을 글 폭에 맞춘다. */}
      <div className="-mr-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
