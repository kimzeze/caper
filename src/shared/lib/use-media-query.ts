"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 미디어 쿼리가 맞는지. 화면 폭이 바뀌면 다시 그린다.
 * 서버(그리고 붙기 전 첫 그림)에서는 false 라, 맞을 때만 달라지는 것은 열 때 그리는 것(팝업 그릇 등)에 쓴다.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
