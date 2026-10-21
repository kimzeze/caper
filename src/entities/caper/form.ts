import { z } from "zod";

import { CAPER_CAPACITY, JOIN_POLICIES } from "./recruit";
import { CAPER_LIMITS, CREW_NAME_MAX, TITLE_PLACEMENTS } from "./schema";

// 모집 인원을 정할지. unlimited 면 capacity 칸 값은 남겨 두되 쓰지 않는다(다시 고르면 그대로 보인다).
export const CAPACITY_MODES = ["unlimited", "limited"] as const;

// 만들기 편집기의 글 항목과 제목 위치 검사. 사진은 폼 밖(초안 store)에서 다룬다. 화면에 보일 오류 문구는 여기 한 곳에 둔다.
// 입력 칸은 늘 문자열이라 비운 선택 항목은 빈 문자열이다. caper로 바꿀 때 빈 값은 뺀다.
export const createCaperSchema = z
  .object({
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
    // 사진이 있을 때만 고를 수 있다. 사진이 없으면 over 여도 아래에 둔다(isTitleOverCover).
    titlePlacement: z.enum(TITLE_PLACEMENTS),
    // 날짜(YYYY-MM-DD)와 시작·끝(HH:MM). 브라우저 날짜·시간 칸 값 그대로이고 비우면 빈 문자열이다.
    date: z.union([z.literal(""), z.iso.date("날짜를 다시 골라야 합니다.")]),
    startTime: z.union([
      z.literal(""),
      z.iso.time({ precision: -1, error: "시작 시간을 다시 골라야 합니다." }),
    ]),
    endTime: z.union([
      z.literal(""),
      z.iso.time({ precision: -1, error: "끝나는 시간을 다시 골라야 합니다." }),
    ]),
    capacityMode: z.enum(CAPACITY_MODES),
    // 숫자 칸 값(문자열). 범위는 아래에서 본다.
    capacity: z.string().trim(),
    joinPolicy: z.enum(JOIN_POLICIES),
  })
  .superRefine(({ date, startTime, endTime }, context) => {
    if ((startTime || endTime) && !date) {
      context.addIssue({
        code: "custom",
        path: ["date"],
        message: "시간을 넣으려면 날짜도 넣어야 합니다.",
      });
    }
    if (endTime && !startTime) {
      context.addIssue({
        code: "custom",
        path: ["startTime"],
        message: "끝나는 시간만 넣을 수는 없습니다. 시작 시간도 넣어야 합니다.",
      });
    }
    if (startTime && endTime && endTime <= startTime) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "끝나는 시간은 시작 시간보다 늦어야 합니다.",
      });
    }
  })
  .superRefine(({ capacityMode, capacity }, context) => {
    if (capacityMode === "limited" && toCapacity(capacity) === undefined) {
      context.addIssue({
        code: "custom",
        path: ["capacity"],
        message: `모집 인원은 ${CAPER_CAPACITY.min}명부터 ${CAPER_CAPACITY.max}명까지 정할 수 있습니다.`,
      });
    }
  });

/** 숫자 칸 값을 모집 인원으로. 정수가 아니거나 범위 밖이면 undefined. */
export function toCapacity(value: string): number | undefined {
  if (!/^\d+$/.test(value.trim())) return undefined;
  const capacity = Number(value);
  return capacity >= CAPER_CAPACITY.min && capacity <= CAPER_CAPACITY.max
    ? capacity
    : undefined;
}

export type CreateCaperFormValues = z.infer<typeof createCaperSchema>;

export const EMPTY_CREATE_CAPER_FORM: CreateCaperFormValues = {
  title: "",
  slogan: "",
  subtitle: "",
  description: "",
  titlePlacement: "below",
  date: "",
  startTime: "",
  endTime: "",
  capacityMode: "unlimited",
  capacity: "",
  joinPolicy: "instant",
};

// 참여하기: with 에 보일 이름. 카카오 로그인이 붙으면 프로필 이름을 채워 둔다.
export const joinCaperSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "with에 보일 이름을 써야 합니다.")
    .max(CREW_NAME_MAX, `이름은 ${CREW_NAME_MAX}자까지 쓸 수 있습니다.`),
});

export type JoinCaperFormValues = z.infer<typeof joinCaperSchema>;
