import { z } from "zod";

import { CAPER_LIMITS } from "./schema";

// 만들기 편집기의 글 항목 검사. 화면에 보일 오류 문구는 여기 한 곳에 둔다.
// 입력 칸은 늘 문자열이라 비운 선택 항목은 빈 문자열이다. caper로 바꿀 때 빈 값은 뺀다.
export const createCaperSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 써야 만들 수 있습니다.")
    .max(
      CAPER_LIMITS.title,
      `제목은 ${CAPER_LIMITS.title}자까지 쓸 수 있습니다.`,
    ),
  slogan: z
    .string()
    .trim()
    .max(
      CAPER_LIMITS.slogan,
      `슬로건은 ${CAPER_LIMITS.slogan}자까지 쓸 수 있습니다.`,
    ),
  subtitle: z
    .string()
    .trim()
    .max(
      CAPER_LIMITS.subtitle,
      `부제는 ${CAPER_LIMITS.subtitle}자까지 쓸 수 있습니다.`,
    ),
  description: z
    .string()
    .trim()
    .max(
      CAPER_LIMITS.description,
      `설명은 ${CAPER_LIMITS.description}자까지 쓸 수 있습니다.`,
    ),
});

export type CreateCaperFormValues = z.infer<typeof createCaperSchema>;

export const EMPTY_CREATE_CAPER_FORM: CreateCaperFormValues = {
  title: "",
  slogan: "",
  subtitle: "",
  description: "",
};
