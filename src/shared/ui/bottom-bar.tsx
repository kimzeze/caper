import type { ReactNode } from "react";

// 화면 아래에 붙는 줄. 긴 글을 읽는 중에도 보이게 아래에 붙인다(sticky).
// 고정(fixed)이 아니라 맨 아래까지 내리면 제자리로 돌아가 뒤의 내용을 가리지 않는다. 아이폰 홈 막대만큼 아래를 띄운다.
// 넓은 화면에서는 프로젝트 페이지와 같은 2단 격자(wide-col + article-grid)의 오른쪽 본문 칸에 내용을 둔다.
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 border-t bg-background">
      <div className="measure-col pt-[0.5rlh] pb-[max(0.5rlh,env(safe-area-inset-bottom))] lg:wide-col lg:article-grid">
        <div className="lg:col-start-2">{children}</div>
      </div>
    </div>
  );
}
