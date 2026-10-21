import Link from "next/link";

import ThemeToggle from "@/shared/ui/theme-toggle";

// 모든 화면 맨 위 한 줄: 왼쪽에 이름, 오른쪽 끝에 테마 버튼(design-system-a의 서비스 헤더와 같은 자리).
export function SiteHeader() {
  return (
    <header className="measure-col flex min-h-control items-center justify-between pt-[1.5rlh]">
      <Link href="/" className="font-bold no-underline hover:underline">
        Caper
      </Link>
      {/* 아이콘 버튼의 안쪽 여백만큼 당겨 오른쪽 선을 글 폭에 맞춘다. */}
      <div className="-mr-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
