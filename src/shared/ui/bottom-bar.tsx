import type { ReactNode } from "react";

// 화면 아래에 붙는 줄. 긴 글을 읽는 중에도 보이게 아래에 붙인다(sticky).
// 고정(fixed)이 아니라 맨 아래까지 내리면 제자리로 돌아가 뒤의 내용을 가리지 않는다. 아이폰 홈 막대만큼 아래를 띄운다.
// 넓은 화면에서는 2단 바깥 폭(wide-col)에서 왼쪽 정보 칸과 사이만큼 비우고 오른쪽 본문 칸에 맞춘다.
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 border-t bg-background">
      <div className="measure-col pt-[0.5rlh] pb-[max(0.5rlh,env(safe-area-inset-bottom))] lg:wide-col">
        <div className="lg:ml-[calc(var(--aside)+var(--aside-gap))]">
          {children}
        </div>
      </div>
    </div>
  );
}
