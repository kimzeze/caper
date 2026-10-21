"use client";

import { clsx } from "clsx";
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useCallback,
} from "react";

function fitHeight(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

// 편집기 칸 — 완성 모습 그대로 바로 쓰는 칸(글쓰기 편집기). 테두리 없이 흐린 안내 글만 보이고, 쓰는 만큼 높이가 는다.
// 테두리가 없어 외곽선 대신 초점이면 아래에 2px 초록 줄을 긋는다. 글자 크기와 굵기는 쓰는 쪽이 완성 화면과 같게 준다.
// singleLine: 줄바꿈을 받지 않는다. 엔터는 onEnter(다음 칸으로), 붙여 넣은 줄바꿈은 공백으로 바꾼다.
// maxLines: 그 줄 수까지 엔터가 줄을 바꾸고, 다 차면 엔터는 onEnter. 붙여 넣어 넘친 줄은 마지막 줄에 공백으로 잇는다.
// 폰 키보드에는 Shift+Enter 가 없어 엔터 하나로 줄을 바꾼다.
// 한글 조합 중의 엔터(글자 확정)는 그대로 둔다.
export default function EditorText({
  singleLine,
  maxLines,
  onEnter,
  className,
  onChange,
  onKeyDown,
  onInput,
  ref,
  rows = 1,
  ...props
}: ComponentPropsWithRef<"textarea"> & {
  singleLine?: boolean;
  maxLines?: number;
  onEnter?: () => void;
}) {
  const lineLimit = singleLine ? 1 : maxLines;
  // 처음 붙을 때 들어 있는 글(임시 저장)에 맞춰 높이를 잡고, 쓰는 쪽 ref(React Hook Form 등)에도 넘긴다.
  const setRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (element !== null) fitHeight(element);
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref],
  );

  return (
    <textarea
      ref={setRef}
      rows={rows}
      className={clsx(
        "block w-full resize-none overflow-hidden border-b-2 border-transparent bg-transparent p-0 placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none",
        className,
      )}
      onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (
          lineLimit !== undefined &&
          event.key === "Enter" &&
          !event.nativeEvent.isComposing &&
          event.currentTarget.value.split("\n").length >= lineLimit
        ) {
          event.preventDefault();
          onEnter?.();
        }
        onKeyDown?.(event);
      }}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        if (lineLimit !== undefined) {
          const lines = event.target.value.split(/\r?\n/);
          if (lines.length > lineLimit) {
            event.target.value = [
              ...lines.slice(0, lineLimit - 1),
              lines.slice(lineLimit - 1).join(" "),
            ].join("\n");
          }
        }
        onChange?.(event);
      }}
      onInput={(event) => {
        fitHeight(event.currentTarget);
        onInput?.(event);
      }}
      {...props}
    />
  );
}
