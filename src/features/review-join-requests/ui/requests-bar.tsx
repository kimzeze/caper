import BottomBar from "@/shared/ui/bottom-bar";
import { buttonClass } from "@/shared/ui/button-class";

import { JOIN_REQUESTS_ID } from "../config";

// 만든 사람의 아래 줄. 신청이 있으면 몇 명이 기다리는지와 목록으로 가는 보기, 없으면 줄이 없다.
export function RequestsBar({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <BottomBar>
      <div className="flex min-h-control items-center justify-between gap-4">
        <p role="status" className="text-base text-muted-foreground">
          승인 기다림 {count}명
        </p>
        <a
          href={`#${JOIN_REQUESTS_ID}`}
          className={buttonClass({
            className: "no-underline focus-visible:text-foreground",
          })}
        >
          보기
        </a>
      </div>
    </BottomBar>
  );
}
