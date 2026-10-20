import type { Caper, CaperImage } from "./types";

/**
 * 사진 경로를 화면에서 쓸 주소로 바꾼다. 지금은 미리보기 샘플(public/preview)만 있어 경로를 그대로 쓴다.
 * Supabase Storage를 붙일 때 이 함수만 바꾼다(DB에는 경로만 저장한다).
 */
export function imageUrl(image: CaperImage): string {
  return `/${image.path}`;
}

/** 표지는 첫 장이다. 사진이 없으면 없다. */
export function coverImage(caper: Caper): CaperImage | undefined {
  return caper.images[0];
}

/** 제목을 표지 위에 얹는지. 작성자가 over 를 골라도 사진이 없으면 아래에 둔다. */
export function isTitleOverCover(caper: Caper): boolean {
  return caper.titlePlacement === "over" && caper.images.length > 0;
}
