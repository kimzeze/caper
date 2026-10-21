"use client";

import {
  type ChangeEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { CAPER_IMAGE_RATIO, CAPER_LIMITS } from "@/entities/caper";
import IconButton from "@/shared/ui/icon-button";
import PhotoCarousel, {
  type PhotoCarouselHandle,
} from "@/shared/ui/photo-carousel";
import Status from "@/shared/ui/status";

import { PhotoThumbnails } from "./photo-thumbnails";

/** 편집기에 보일 사진 하나(화면 주소까지). */
export type EditorPhoto = { id: string; src: string };

const ASPECT = `${CAPER_IMAGE_RATIO.width} / ${CAPER_IMAGE_RATIO.height}`;

// 편집기 맨 위 사진 자리. 사진이 없으면 4:5 빈 자리("사진 추가"), 있으면 프로젝트 페이지와 같은 사진 넘기기,
// 지금 보이는 장의 지우기·사진 추가, 그 아래 끌어서 순서를 바꾸는 썸네일 줄.
// 사진 고르기(여러 장)만 하고, 자르기는 쓰는 쪽(onPickFiles)이 한다. cover 는 첫 장 위에 얹을 것(사진 위 제목 미리 보기).
// 디자인은 나중이고 지금은 기능 위주다.
export function EditorPhotos({
  photos,
  notice,
  cover,
  onPickFiles,
  onRemove,
  onReorder,
}: {
  photos: readonly EditorPhoto[];
  cover?: ReactNode;
  notice?: string | null;
  onPickFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onReorder: (ids: string[]) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<PhotoCarouselHandle>(null);
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const current = photos[Math.min(index, count - 1)];
  const full = count >= CAPER_LIMITS.images;

  const pick = () => inputRef.current?.click();
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    // 같은 사진을 다시 골라도 change 가 나도록 비운다.
    event.target.value = "";
    if (files.length > 0) onPickFiles(files);
  };

  // 썸네일을 누르거나 옮긴 사진이 보이게 그 장으로 넘긴다.
  const show = (to: number) => {
    carouselRef.current?.scrollToIndex(to);
    setIndex(to);
  };

  return (
    <div className="mx-auto w-full max-w-(--measure)">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onChange}
      />
      {count === 0 ? (
        <button
          type="button"
          onClick={pick}
          style={{ aspectRatio: ASPECT }}
          className="flex w-full flex-col items-center justify-center gap-2 focus-fill bg-muted text-muted-foreground transition-colors hover:bg-foreground hover:text-background [&_svg]:size-8"
        >
          <ImagePlus aria-hidden />
          사진 추가
          <span className="text-base">
            4:5로 잘라 올립니다. {CAPER_LIMITS.images}장까지.
          </span>
        </button>
      ) : (
        <>
          <PhotoCarousel
            photos={photos.map((photo, photoIndex) => ({
              key: photo.id,
              src: photo.src,
              alt: `사진 ${photoIndex + 1}`,
            }))}
            label={`올린 사진 ${count}장`}
            aspectRatio={ASPECT}
            cover={cover}
            onIndexChange={setIndex}
            ref={carouselRef}
          />
          <div className="measure-col flex flex-wrap items-center justify-between gap-x-4">
            <p className="text-base text-muted-foreground">
              <span className="font-mono">
                {Math.min(index, count - 1) + 1}/{count}
              </span>
              {index === 0 && " 표지"}
            </p>
            <div className="-mr-2 flex items-center">
              <IconButton
                aria-label="이 사진 지우기"
                title="이 사진 지우기"
                onClick={() => current && onRemove(current.id)}
              >
                <Trash2 aria-hidden />
              </IconButton>
              <IconButton
                aria-label="사진 추가"
                title={
                  full ? `사진은 ${CAPER_LIMITS.images}장까지` : "사진 추가"
                }
                disabled={full}
                onClick={pick}
              >
                <ImagePlus aria-hidden />
              </IconButton>
            </div>
          </div>
          <div className="measure-col">
            <PhotoThumbnails
              photos={photos}
              current={Math.min(index, count - 1)}
              onSelect={show}
              onReorder={onReorder}
            />
          </div>
        </>
      )}
      {notice && (
        <Status className="measure-col mt-[0.25rlh] text-base">{notice}</Status>
      )}
    </div>
  );
}
