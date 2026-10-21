"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { CAPER_IMAGE_RATIO, type CaperImage, imageUrl } from "@/entities/caper";

// 프로젝트 페이지 맨 위 사진 넘기기. 사진 틀은 4:5(CAPER_IMAGE_RATIO)로 고정한다.
// 폰에서는 화면 끝까지 차고, 넓은 화면에서는 본문 폭(--measure)까지만 늘어난다(데스크탑 2단은 #7).
// 화살표 없이 브라우저 스크롤 스냅으로 한 장씩 넘기고, 처음과 끝에서 멈춘다(무한 롤링 없음).
// 사진 바로 밑 막대가 지금 위치를 따라간다. 막대는 스크롤 이벤트에서 직접 옮긴다
// (CSS 스크롤 애니메이션은 아직 Baseline Widely available이 아니다).
// coverTitle 이 있으면 표지(첫 장) 아래쪽에 어두운 막을 깔고 제목을 얹는다.
export function CaperGallery({
  images,
  title,
  coverTitle,
}: {
  images: readonly CaperImage[];
  title: string;
  coverTitle?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const count = images.length;

  useEffect(() => {
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (list === null || thumb === null) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = list.scrollWidth - list.clientWidth;
      const progress = max > 0 ? list.scrollLeft / max : 0;
      // 막대 폭은 전체의 1/count. 자기 폭 단위로 0 ~ (count - 1)칸 옮긴다.
      thumb.style.transform = `translateX(${progress * (count - 1) * 100}%)`;
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

  return (
    <section
      aria-label={`${title} 사진 ${count}장`}
      className="mx-auto w-full max-w-(--measure)"
    >
      <div className="relative">
        <ul
          ref={listRef}
          // 키보드로도 넘길 수 있게 초점을 받는다(방향키가 그대로 가로 스크롤이 된다).
          // 사진(위치 지정 요소)이 목록의 외곽선을 덮으므로, 초점 표시는 아래 겹친 층이 그린다.
          tabIndex={count > 1 ? 0 : undefined}
          style={{
            aspectRatio: `${CAPER_IMAGE_RATIO.width} / ${CAPER_IMAGE_RATIO.height}`,
          }}
          className="peer flex w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <li
              key={`${image.path}-${index}`}
              aria-label={`${index + 1} / ${count}`}
              className="relative h-full w-full shrink-0 snap-start snap-always"
            >
              <Image
                src={imageUrl(image)}
                alt={`${title} 사진 ${index + 1}`}
                fill
                sizes="(min-width: 45rem) 45rem, 100vw"
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
              {index === 0 && coverTitle !== undefined && (
                // 사진 위 글자는 사진에 따라 안 읽힐 수 있어 아래쪽에만 어두운 막을 깐다. 글자는 모드와 상관없이 밝다.
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-stone-950/75 via-stone-950/40 to-transparent pt-[3rlh] pb-[1.5rlh]">
                  <div className="measure-col">
                    <h1 className="text-stone-50">{coverTitle}</h1>
                  </div>
                </div>
              )}
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
