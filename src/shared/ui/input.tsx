"use client";

import { clsx } from "clsx";
import type { ComponentProps } from "react";
import { useFieldLabel } from "./field";

// 한 줄 입력 — 2px 잉크 상자, 높이 44px. 내용 폭에 맞춰 늘고 준다(최소 20ch).
// width 를 주면 그 글자 수(ch)만큼의 고정 폭(숫자 몇 자리 칸 등). "fill" 은 가로 flex 줄의 남은 폭을 채운다.
// 라벨은 칸 위, 설명은 라벨 아래(쓰는 쪽이 둔다). Field 안이면 그 라벨이 이름. 표준 input prop 그대로.
export default function Input({
  className,
  width,
  style,
  ...props
}: ComponentProps<"input"> & { width?: number | "fill" }) {
  const labelledBy = useFieldLabel();
  return (
    <input
      type="text"
      aria-labelledby={labelledBy}
      className={clsx(
        "h-control max-w-full border-2 focus-border border-foreground bg-background px-3.5 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        width === undefined
          ? "[field-sizing:content] min-w-[20ch]"
          : width === "fill"
            ? "w-0 min-w-0 flex-1"
            : "min-w-0",
        className,
      )}
      // 글자 폭 + 좌우 여백(px-3.5 둘) + 테두리(2px 둘)
      style={
        typeof width !== "number"
          ? style
          : { width: `calc(${width}ch + 1.75rem + 4px)`, ...style }
      }
      {...props}
    />
  );
}
