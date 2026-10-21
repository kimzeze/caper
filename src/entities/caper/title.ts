import { z } from "zod";

// 제목은 작성자가 읽기 좋게 줄을 바꿀 수 있다(\n, CAPER_LIMITS.titleLines 줄까지).
// 화면은 바꾼 자리 그대로 그리고(white-space: pre-line), 한 줄이어야 하는 곳(사진 대체 글 등)은 titleOneLine 을 쓴다.

/** 줄마다 앞뒤 공백을 빼고 빈 줄을 없앤다. 저장하기 전에 한 번 거친다. */
export function normalizeTitle(title: string): string {
  return title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

/** 줄 바꿈을 공백으로 바꾼 한 줄 제목. */
export function titleOneLine(title: string): string {
  return normalizeTitle(title).replace(/\n/g, " ");
}

export function titleLineCount(title: string): number {
  return title.split("\n").length;
}

// 표지 위 제목 자리(제목을 사진 위에 얹었을 때). x·y 는 0~1(왼쪽·위 0, 오른쪽·아래 1)이고 없으면 기본(왼쪽 아래).
// 비율이라 사진 폭·제목 길이가 달라도 같은 자리다. 그리는 쪽은 shared/ui/cover-text.
export const titlePositionSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export type TitlePosition = z.infer<typeof titlePositionSchema>;
