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
// 한글 조합 중의 엔터(글자 확정)는 그대로 둔다.
export default function EditorText({
  singleLine,
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
  onEnter?: () => void;
}) {
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
          singleLine &&
          event.key === "Enter" &&
          !event.nativeEvent.isComposing
        ) {
          event.preventDefault();
          onEnter?.();
        }
        onKeyDown?.(event);
      }}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        if (singleLine && /\r?\n/.test(event.target.value)) {
          event.target.value = event.target.value.replace(/\r?\n/g, " ");
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
