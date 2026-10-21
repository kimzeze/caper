"use client";

import { useEffect, useRef, useState } from "react";

import { loadPhotoBlob } from "../lib/photo-blobs";
import type { DraftPhoto } from "../model/draft-store";

/**
 * 초안 사진의 화면 주소(blob:). IndexedDB에서 사진을 꺼내 주소를 만들고, 빠진 사진의 주소는 거둔다.
 * 순서만 바뀌면 주소를 다시 만들지 않는다(같은 id는 같은 주소). 아직 꺼내지 못한 사진은 목록에 없다.
 */
export function useDraftPhotoUrls(
  photos: readonly DraftPhoto[] | undefined,
): Record<string, string> {
  const cache = useRef(new Map<string, string>());
  const [urls, setUrls] = useState<Record<string, string>>({});
  const ids = (photos ?? []).map((photo) => photo.id).join(",");

  useEffect(() => {
    let cancelled = false;
    const wanted = ids === "" ? [] : ids.split(",");

    for (const [id, url] of cache.current) {
      if (!wanted.includes(id)) {
        URL.revokeObjectURL(url);
        cache.current.delete(id);
      }
    }

    void Promise.all(
      wanted
        .filter((id) => !cache.current.has(id))
        .map(async (id) => {
          const blob = await loadPhotoBlob(id);
          if (blob !== undefined && !cancelled && !cache.current.has(id)) {
            cache.current.set(id, URL.createObjectURL(blob));
          }
        }),
    ).then(() => {
      if (!cancelled) setUrls(Object.fromEntries(cache.current));
    });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  // 화면을 떠나면 만든 주소를 모두 거둔다.
  useEffect(() => {
    const created = cache.current;
    return () => {
      for (const url of created.values()) URL.revokeObjectURL(url);
      created.clear();
    };
  }, []);

  return urls;
}
