"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { useFieldLabel } from "./field";

// 여러 줄 입력 — 한 줄 입력과 같은 2px 잉크 상자에 높이만 늘린다(rows). 코드를 받는 곳은 font-mono 를 준다.
export default function Textarea({
  className,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  // Field 안이면 그 라벨이 이름
  const labelledBy = useFieldLabel();
  return (
    <textarea
      aria-labelledby={labelledBy}
      className={clsx(
        "w-full border-2 focus-border border-foreground bg-background px-3.5 py-2.5 leading-normal placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
