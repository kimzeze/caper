"use client";

import {
  type ReactNode,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";

export type CarouselPhoto = { key: string; src: string; alt: string };

/** 바깥에서 넘기기(사진 순서를 옮긴 뒤 그 장을 보이기 등). */
export type PhotoCarouselHandle = { scrollToIndex: (index: number) => void };

// 사진 넘기기 — 사진을 옆으로 한 장씩 넘긴다. 화살표 없이 브라우저 스크롤 스냅으로 넘기고, 처음과 끝에서 멈춘다
// (무한 롤링 없음). 사진 바로 밑 막대가 지금 위치를 따라간다. 막대는 스크롤 이벤트에서 직접 옮긴다
// (CSS 스크롤 애니메이션은 아직 Baseline Widely available이 아니다).
// 틀 비율은 aspectRatio("4 / 5" 같은 값), 사진은 틀을 채운다(object-cover).
// cover 는 첫 장 위에 얹을 것(표지 위 제목 등). onIndexChange 는 지금 보이는 장이 바뀔 때 부른다.
// ref 로 scrollToIndex 를 쓸 수 있다.
// 브라우저에서 만든 사진(blob: 주소)은 Next 이미지 최적화를 거치지 않는다.
export default function PhotoCarousel({
  photos,
  label,
  aspectRatio,
  cover,
  onIndexChange,
  ref,
  sizes = "(min-width: 45rem) 45rem, 100vw",
}: {
  photos: readonly CarouselPhoto[];
  label: string;
  aspectRatio: string;
  cover?: ReactNode;
  onIndexChange?: (index: number) => void;
  ref?: Ref<PhotoCarouselHandle>;
  sizes?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const onIndexChangeRef = useRef(onIndexChange);
  const count = photos.length;

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  useEffect(() => {
    const list = listRef.current;
    if (list === null) return;

    let frame = 0;
    let lastIndex = -1;
    const update = () => {
      frame = 0;
      const max = list.scrollWidth - list.clientWidth;
      const progress = max > 0 ? list.scrollLeft / max : 0;
      // 막대 폭은 전체의 1/count. 자기 폭 단위로 0 ~ (count - 1)칸 옮긴다.
      if (thumbRef.current !== null) {
        thumbRef.current.style.transform = `translateX(${progress * (count - 1) * 100}%)`;
      }
      const index =
        list.clientWidth > 0
          ? Math.round(list.scrollLeft / list.clientWidth)
          : 0;
      if (index !== lastIndex) {
        lastIndex = index;
        onIndexChangeRef.current?.(index);
      }
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index) => {
      const list = listRef.current;
      list?.scrollTo({ left: index * list.clientWidth });
    },
  }));

  return (
    <section aria-label={label}>
      <div className="relative">
        <ul
          ref={listRef}
          // 키보드로도 넘길 수 있게 초점을 받는다(방향키가 그대로 가로 스크롤이 된다).
          // 사진(위치 지정 요소)이 목록의 외곽선을 덮으므로, 초점 표시는 아래 겹친 층이 그린다.
          tabIndex={count > 1 ? 0 : undefined}
          style={{ aspectRatio }}
          className="peer flex w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, index) => (
            <li
              key={photo.key}
              aria-label={`${index + 1} / ${count}`}
              className="relative h-full w-full shrink-0 snap-start snap-always"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={sizes}
                unoptimized={photo.src.startsWith("blob:")}
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
              {index === 0 && cover}
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden border-3 border-accent peer-focus-visible:block"
        />
      </div>
      {count > 1 && (
        // 위치 막대는 사진 바로 밑에 여백 없이, 사진과 같은 폭으로 붙인다.
        <div aria-hidden className="h-0.5 bg-muted">
          <span
            ref={thumbRef}
            className="block h-full bg-foreground"
            style={{ width: `${100 / count}%` }}
          />
        </div>
      )}
    </section>
  );
}
