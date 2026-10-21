"use client";

import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";
import { type Control, useController, useWatch } from "react-hook-form";

import type { CreateCaperFormValues } from "@/entities/caper";
import CoverText, {
  type CoverPosition,
  DEFAULT_COVER_POSITION,
} from "@/shared/ui/cover-text";

// 가장자리·가운데에 이만큼(비율) 가까우면 붙는다. 붙은 가운데 선은 끄는 동안 보인다.
const SNAP = 0.04;
const SNAP_POINTS = [0, 0.5, 1];
// 방향키 한 번(Shift 면 크게).
const STEP = 0.02;
const BIG_STEP = 0.1;

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const snap = (value: number) =>
  SNAP_POINTS.find((point) => Math.abs(point - value) < SNAP) ?? value;
const round = (value: number) => Math.round(value * 1000) / 1000;

// 편집기 표지 위 제목 — 제목을 사진 위에 얹으면 첫 사진에 바로 보인다(프로젝트 페이지 폰 표지와 같은 모습).
// 손가락·마우스로 끌어 옮기고(인스타그램 글자처럼), 초점을 주면 방향키로 옮긴다. 끄는 동안 사진은 옆으로 넘어가지 않는다.
// 끄는 동안은 화면에만 두고 놓을 때 한 번 폼(초안)에 넣는다. 기본 자리(왼쪽 아래)면 null 로 둔다.
export function CoverTitleEditor({
  control,
  categoryName,
}: {
  control: Control<CreateCaperFormValues>;
  categoryName?: string;
}) {
  const title = useWatch({ control, name: "title" });
  const shade = useWatch({ control, name: "coverShade" });
  const { field } = useController({ control, name: "titlePosition" });
  const [live, setLive] = useState<CoverPosition | null>(null);
  const liveRef = useRef<CoverPosition | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointer: number;
    startX: number;
    startY: number;
    from: CoverPosition;
    freeWidth: number;
    freeHeight: number;
  } | null>(null);

  const position = live ?? field.value ?? DEFAULT_COVER_POSITION;

  const commit = (next: CoverPosition) => {
    const value = { x: round(next.x), y: round(next.y) };
    const isDefault =
      value.x === DEFAULT_COVER_POSITION.x &&
      value.y === DEFAULT_COVER_POSITION.y;
    field.onChange(isDefault ? null : value);
  };

  const show = (next: CoverPosition | null) => {
    liveRef.current = next;
    setLive(next);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const area = areaRef.current?.getBoundingClientRect();
    const block = blockRef.current?.getBoundingClientRect();
    if (area === undefined || block === undefined) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    // 글 묶음이 움직일 수 있는 폭·높이(여백 상자 - 글 묶음). 비율 1 이 이만큼이다.
    drag.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      from: position,
      freeWidth: area.width - block.width,
      freeHeight: area.height - block.height,
    };
    show(position);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (current === null || current.pointer !== event.pointerId) return;
    const x =
      current.freeWidth > 0
        ? current.from.x + (event.clientX - current.startX) / current.freeWidth
        : 0;
    const y =
      current.freeHeight > 0
        ? current.from.y + (event.clientY - current.startY) / current.freeHeight
        : 0;
    show({ x: snap(clamp(x)), y: snap(clamp(y)) });
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer !== event.pointerId) return;
    drag.current = null;
    if (liveRef.current !== null) commit(liveRef.current);
    show(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? BIG_STEP : STEP;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (move === undefined) return;
    // 방향키가 사진 넘기기(가로 스크롤)로 가지 않게 막는다.
    event.preventDefault();
    commit({ x: clamp(position.x + move[0]), y: clamp(position.y + move[1]) });
  };

  const dragging = live !== null;

  return (
    <CoverText
      position={position}
      shade={shade}
      areaRef={areaRef}
      blockRef={blockRef}
      guides={
        dragging && (
          <>
            {position.x === 0.5 && (
              <span
                aria-hidden
                className="absolute inset-y-0 left-1/2 w-px bg-stone-50/70"
              />
            )}
            {position.y === 0.5 && (
              <span
                aria-hidden
                className="absolute inset-x-0 top-1/2 h-px bg-stone-50/70"
              />
            )}
          </>
        )
      }
      blockProps={{
        tabIndex: 0,
        role: "group",
        "aria-label": "사진 위 제목. 끌거나 방향키로 옮깁니다",
        onPointerDown,
        onPointerMove,
        onPointerUp: onPointerEnd,
        onPointerCancel: onPointerEnd,
        onKeyDown,
        className:
          "cursor-grab touch-none outline-offset-4 select-none focus-visible:outline-3 focus-visible:outline-accent active:cursor-grabbing",
      }}
    >
      {categoryName && (
        <p className="text-base text-stone-200">{categoryName}</p>
      )}
      <p
        className={
          title.trim()
            ? "text-[1.5rem] leading-[1.3] font-bold tracking-[-0.04em] whitespace-pre-line lg:text-[1.875rem]"
            : "text-[1.5rem] leading-[1.3] font-bold tracking-[-0.04em] text-stone-50/60 lg:text-[1.875rem]"
        }
      >
        {title.trim() || "제목"}
      </p>
    </CoverText>
  );
}
