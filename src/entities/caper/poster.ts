import type { Poster } from "./types";

/**
 * 포스터 경로를 화면에서 쓸 주소로 바꾼다. 지금은 미리보기 샘플(public/preview)만 있어 경로를 그대로 쓴다.
 * Supabase Storage를 붙일 때 이 함수만 바꾼다(DB에는 경로만 저장한다).
 */
export function posterUrl(poster: Poster): string {
  return `/${poster.path}`;
}
