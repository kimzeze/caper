"use client";

import type { ReactNode, RefObject } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { Popover } from "@base-ui/react/popover";
import { X } from "lucide-react";

import { useMediaQuery } from "../lib/use-media-query";

// 넓은 화면은 칸 아래에 붙는 팝오버, 좁은 화면은 아래에서 올라오는 시트(bottom sheet).
const WIDE = "(min-width: 40rem)";

// 고르기 그릇 — 칸 하나를 고르는 내용(찾기·목록 등)을 화면 크기에 맞는 그릇에 담는다.
// - 넓은 화면: 칸(anchor) 바로 아래 팝오버. 쓰던 자리에서 흐름이 끊기지 않는다. 열리면 initialFocus(찾기 칸)에 초점.
// - 좁은 화면: 아래 시트. 엄지가 닿는 아래쪽, 아래로 쓸어 닫기, 화면 키보드가 올라오면 같이 올라간다.
//   열 때 키보드를 띄우지 않으려고 초점은 닫기 버튼에 둔다(목록이 먼저 보인다).
// 열고 닫기는 쓰는 쪽이 한다(open, onOpenChange). 닫히면 칸으로 초점이 돌아온다.
// 2px 잉크 테두리, 둥근 모서리·그림자 없음, 나타남·사라짐 0.15초(움직임 줄이기면 없음).
// 안에서 목록 높이를 쓰는 쪽이 정하되, 시트에서는 남은 높이를 다 쓰게 [data-picker-list] 의 최대 높이를 푼다.
export default function PickerPopup({
  open,
  onOpenChange,
  anchor,
  title,
  initialFocus,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: RefObject<HTMLElement | null>;
  /** 그릇의 이름(화면 읽기, 시트 제목). */
  title: string;
  /** 넓은 화면에서 열릴 때 초점을 줄 곳. */
  initialFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const wide = useMediaQuery(WIDE);

  if (wide) {
    return (
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Portal>
          <Popover.Positioner
            anchor={anchor}
            side="bottom"
            align="start"
            sideOffset={4}
            className="z-50"
          >
            <Popover.Popup
              aria-label={title}
              initialFocus={initialFocus}
              finalFocus={anchor}
              className="w-80 max-w-(--available-width) border-2 border-foreground bg-background text-foreground transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
            >
              {children}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.VirtualKeyboardProvider>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
          <Drawer.Viewport className="fixed inset-0 z-50 flex items-end">
            <Drawer.Popup
              finalFocus={anchor}
              className="flex max-h-[85dvh] w-full [transform:translateY(var(--drawer-swipe-movement-y))] flex-col border-t-2 border-foreground bg-background pb-[env(safe-area-inset-bottom)] text-foreground transition-transform duration-150 outline-none data-ending-style:[transform:translateY(100%)] data-starting-style:[transform:translateY(100%)] data-swiping:duration-0 motion-reduce:transition-none"
            >
              <div className="flex min-h-control w-full shrink-0 items-center justify-between pt-[0.25rlh] pr-1 pl-3.5">
                <Drawer.Title className="font-bold">{title}</Drawer.Title>
                <Drawer.Close
                  aria-label="닫기"
                  className="inline-flex min-h-control min-w-control items-center justify-center focus-fill hover:bg-foreground hover:text-background"
                >
                  <X aria-hidden className="size-[1.25em]" />
                </Drawer.Close>
              </div>
              <Drawer.Content className="flex min-h-0 flex-1 flex-col [&_[data-picker-list]]:max-h-none">
                {children}
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.VirtualKeyboardProvider>
    </Drawer.Root>
  );
}
