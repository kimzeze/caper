"use client";

import { clsx } from "clsx";
import { type MouseEvent, useId, useState } from "react";
import { useFieldLabel } from "./field";

type Option = string | { value: string; label: string };

// 라디오 그룹 — 여럿 중 하나. 넷을 넘으면 Select.
// - 가로(기본): 붙은 칸(세그먼트)에서 고른 칸만 반전. 짧은 라벨 몇 개를 한 줄에.
//   w-fit: 세로 flex 안(데모 대부분)에선 자식이 폭 전체로 늘어나 마지막 칸 뒤가 빈 채로 이어져 보인다. 내용만큼만 차지하게 막는다.
//   줄을 꺾으면 칸 테두리가 어긋나니 꺾지 않는다. 좁은 화면에선 칸 여백을 줄이고, 그래도 넘치면 가로로 민다.
// - 세로(orientation="vertical"): 줄마다 동그라미 + 라벨(라디오 목록). 라벨이 길거나 질문의 답을 고를 때.
//   동그라미는 모서리를 둥글리지 않는 규칙의 예외다. 체크박스(채운 네모)와 구별되고, 라디오는 누구나 동그라미로 안다.
// - options: 문자열 배열이거나 {value,label}(라벨이 값과 다를 때).
// - controlled(value+onValueChange) / uncontrolled(defaultValue) 둘 다.
// - 네이티브 radio 를 쓴다: 탭 스톱 하나, 방향키로 이동·선택은 브라우저가 한다.
// - 고대비(forced-colors)에선 브라우저가 바탕색을 덮으므로 시스템 색(Highlight·CanvasText)으로 직접 칠한다.
export default function RadioGroup({
  options,
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  "aria-label": ariaLabel,
}: {
  options: Option[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
}) {
  const name = useId();
  // Field 안이면 그 라벨이 이름이다(aria-label 은 보이는 라벨이 없을 때만)
  const labelledBy = useFieldLabel();
  const norm = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? norm[0]?.value);
  const current = controlled ? value : internal;
  const vertical = orientation === "vertical";
  const pick = (v: string) => {
    if (!controlled) setInternal(v);
    onValueChange?.(v);
  };
  // 연달아 누를 때 라벨 글자가 선택되지 않게. Button·Checkbox 와 같다.
  const noSelect = (e: MouseEvent) => {
    if (e.detail > 1) e.preventDefault();
  };

  if (vertical)
    return (
      <div
        role="radiogroup"
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-labelledby={labelledBy}
        aria-orientation="vertical"
        className="flex flex-col items-start"
      >
        {norm.map((o) => (
          <label
            key={o.value}
            onMouseDown={noSelect}
            className="inline-flex min-h-control cursor-pointer items-center gap-2.5"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={o.value === current}
              onChange={() => pick(o.value)}
              className="size-[1.25rem] shrink-0 cursor-[inherit] appearance-none rounded-full border-2 focus-border border-foreground bg-background checked:bg-foreground checked:shadow-[inset_0_0_0_3px_var(--color-background)] focus-visible:checked:shadow-[inset_0_0_0_3px_var(--color-background)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:forced-color-adjust-none forced-colors:checked:bg-[CanvasText] forced-colors:checked:shadow-[inset_0_0_0_3px_Canvas] forced-colors:focus-visible:border-[Highlight]"
            />
            {o.label}
          </label>
        ))}
      </div>
    );

  return (
    <div
      role="radiogroup"
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      aria-orientation="horizontal"
      className="inline-flex w-fit max-w-full overflow-x-auto border-2 border-foreground has-focus-visible:border-accent has-focus-visible:shadow-[inset_0_0_0_1px_var(--color-accent)]"
    >
      {norm.map((o, i) => (
        <label
          key={o.value}
          onMouseDown={noSelect}
          className={clsx(
            "cursor-pointer border-foreground",
            i > 0 && "border-l-2",
          )}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={o.value === current}
            onChange={() => pick(o.value)}
            className="peer sr-only"
          />
          <span className="flex h-[calc(var(--spacing-control)-4px)] items-center px-2.5 press-down whitespace-nowrap transition-colors peer-checked:bg-foreground peer-checked:text-background hover:bg-muted peer-checked:hover:bg-foreground sm:px-3.5 forced-colors:peer-checked:bg-[Highlight] forced-colors:peer-checked:text-[HighlightText] forced-colors:peer-checked:forced-color-adjust-none">
            {o.label}
          </span>
        </label>
      ))}
    </div>
  );
}
