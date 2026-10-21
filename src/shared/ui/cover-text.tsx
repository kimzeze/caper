import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { clsx } from "clsx";

/** 표지 위 글 묶음 자리. x·y 는 0~1(왼쪽·위 0, 오른쪽·아래 1). */
export type CoverPosition = { x: number; y: number };

/** 기본 자리: 왼쪽 아래. */
export const DEFAULT_COVER_POSITION: CoverPosition = { x: 0, y: 1 };

// 음영 띠: 글 묶음이 있는 높이가 가장 어둡고 위아래로 옅어진다. 기본 자리(아래)에서는 아래쪽만 어둡다.
function shadeBand(y: number): string {
  const center = y * 100;
  const dark = "rgb(12 10 9 / 0.75)"; // stone-950
  const clear = "rgb(12 10 9 / 0)";
  return `linear-gradient(to bottom, ${clear} ${center - 45}%, ${dark} ${center}%, ${clear} ${center + 45}%)`;
}

// 표지 위 글 자리 — 사진 위에 글 묶음(제목 등)을 비율 자리(position)에 둔다. 여백 안쪽에서 left: x% 와
// translate(-x%) 로 놓아, 제목 길이·화면 폭이 달라도 글 묶음이 늘 사진 안에 있고 같은 비율 자리에 온다.
// 글은 모드와 상관없이 밝다. shade 면 글 높이를 가운데로 하는 어두운 띠를 깐다.
// 옮기기(편집기)는 쓰는 쪽이 areaRef·blockRef·blockProps 로 붙인다.
export default function CoverText({
  position = DEFAULT_COVER_POSITION,
  shade,
  areaRef,
  blockRef,
  blockProps,
  guides,
  className,
  children,
}: {
  position?: CoverPosition;
  shade: boolean;
  /** 글 묶음이 움직일 수 있는 안쪽 여백 상자. */
  areaRef?: Ref<HTMLDivElement>;
  blockRef?: Ref<HTMLDivElement>;
  blockProps?: HTMLAttributes<HTMLDivElement>;
  /** 여백 상자 안에 겹쳐 그릴 것(옮길 때의 가운데 선 등). */
  guides?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { x, y } = position;
  const place: CSSProperties = {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: `translate(${-x * 100}%, ${-y * 100}%)`,
  };
  return (
    <div
      className={clsx("pointer-events-none absolute inset-0", className)}
      style={shade ? { backgroundImage: shadeBand(y) } : undefined}
    >
      <div
        ref={areaRef}
        className="absolute inset-x-6 top-6 bottom-[1.5rlh] text-stone-50"
      >
        {guides}
        <div
          ref={blockRef}
          {...blockProps}
          className={clsx(
            "pointer-events-auto absolute w-max max-w-full",
            blockProps?.className,
          )}
          style={{ ...place, ...blockProps?.style }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
