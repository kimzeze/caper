"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

// 버튼 — 2px 잉크 테두리, 모서리·그림자 없음, 높이 44px. 올리면 반전, 누르면 내용물만 1px 내려간다(press-down).
// 호버는 반전. primary(초록 테두리)는 한 화면에 하나만. 채우면 너무 튀어 테두리만 칠하고, 호버하면 초록으로 채운다. 아이콘 하나짜리는 IconButton,
// 켜고 끄는 상태는 Checkbox, 여럿 중 하나는 RadioGroup.
// square: 테두리 있는 아이콘 버튼(좌우 여백을 줄여 44px 정사각). multiline: 높이를 내용에 맞춘다(여러 줄 글, 카드 꼴).
export default function Button({
  variant = "default",
  square,
  multiline,
  className,
  onMouseDown,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: "default" | "primary";
  square?: boolean;
  multiline?: boolean;
}) {
  return (
    <button
      type="button"
      // 연달아 누를 때 더블·트리플 클릭으로 옆 글·사진이 선택되지 않게(클릭 자체는 그대로).
      onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
        if (e.detail > 1) e.preventDefault();
        onMouseDown?.(e);
      }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 border-2 focus-border press-down transition-colors",
        square ? "min-w-control px-2" : "px-5",
        multiline
          ? "min-h-control py-2 leading-snug"
          : "h-control leading-none whitespace-nowrap",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:text-muted-foreground",
        variant === "primary"
          ? "border-accent bg-background hover:bg-accent hover:text-on-accent focus-visible:border-foreground focus-visible:shadow-[inset_0_0_0_1px_var(--color-foreground)]"
          : "border-foreground bg-background hover:bg-foreground hover:text-background",
        className,
      )}
      {...props}
    />
  );
}
