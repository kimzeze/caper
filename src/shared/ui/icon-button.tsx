"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

// 아이콘 버튼 — 뜻이 뻔한 아이콘 하나(테마, 닫기, 추천)는 테두리 없이 아이콘만.
// 누를 자리는 44px, 호버는 반전(링크와 같다), 초점은 초록 바탕. aria-label 필수.
// 켜고 끄는 아이콘은 aria-pressed 를 주면 켜졌을 때 아이콘을 초록으로 채운다.
// small: 다른 것 위에 얹는 작은 버튼(썸네일의 삭제 등). 누를 자리가 28px 로 준다.
export default function IconButton({
  small,
  className,
  onMouseDown,
  "aria-label": ariaLabel,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  "aria-label": string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      // 연달아 누를 때 더블·트리플 클릭으로 옆 글·사진이 선택되지 않게(클릭 자체는 그대로).
      onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
        if (e.detail > 1) e.preventDefault();
        onMouseDown?.(e);
      }}
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 focus-fill transition-colors",
        small ? "min-h-7 min-w-7" : "min-h-control min-w-control px-2",
        "press-down hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50",
        "[&_svg]:size-[1.25em]",
        "aria-pressed:[&_svg]:fill-accent aria-pressed:[&_svg]:stroke-accent",
        // 초점 바탕도 초록이라, 켜진 아이콘은 초점일 때 초록 위 글자색(잉크)으로 채워 보이게 한다.
        "focus-visible:aria-pressed:[&_svg]:fill-on-accent focus-visible:aria-pressed:[&_svg]:stroke-on-accent",
        className,
      )}
      {...props}
    />
  );
}
