import { z } from "zod";

import { CAPER_CAPACITY, JOIN_POLICIES } from "./recruit";
import { caperScheduleSchema } from "./schedule";

// caper 하나의 모양. 화면, Server Action, DB(supabase/migrations), iOS 앱이 이 규칙을 따른다.
// 프로젝트 페이지의 내용 순서는 사진(첫 장이 표지) → 제목 → 슬로건 → 부제 → 날짜 → 설명 → with 이다.

export const CAPER_STATUSES = ["planning", "active", "done"] as const;

export const caperStatusSchema = z.enum(CAPER_STATUSES);

// 사진 비율은 인스타그램 세로 사진과 같은 4:5 하나로 고정한다. 올릴 때 이 비율로 자르고,
// 화면의 사진 틀도 이 비율을 쓴다(폰·데스크탑 같음).
export const CAPER_IMAGE_RATIO = { width: 4, height: 5 } as const;

// 반올림으로 생기는 1px 차이 정도는 받아 준다.
const RATIO_TOLERANCE = 0.01;

// 사진은 Storage 경로와 원본 가로·세로만 둔다. 크기는 사진이 오기 전에 자리를 잡는 데 쓴다.
export const caperImageSchema = z
  .object({
    path: z.string().min(1),
    width: z.int().positive(),
    height: z.int().positive(),
  })
  .refine(
    ({ width, height }) =>
      Math.abs(
        width / height - CAPER_IMAGE_RATIO.width / CAPER_IMAGE_RATIO.height,
      ) <= RATIO_TOLERANCE,
    { message: "사진은 4:5 비율이어야 합니다." },
  );

// 제목을 표지(첫 장) 아래에 둘지 위에 얹을지. 사진이 없으면 over 여도 아래에 둔다.
export const TITLE_PLACEMENTS = ["below", "over"] as const;

export const CREW_ROLES = ["owner", "member"] as const;

// with 에 보일 이름의 길이. 참여하기 이름 칸도 같다.
export const CREW_NAME_MAX = 20;

export const crewMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(CREW_NAME_MAX),
  role: z.enum(CREW_ROLES),
});

export const CAPER_LIMITS = {
  title: 40,
  slogan: 60,
  subtitle: 60,
  // 마크다운 기호까지 센 길이다.
  description: 5000,
  images: 10,
} as const;

export const caperSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().trim().min(1).max(CAPER_LIMITS.title),
    titlePlacement: z.enum(TITLE_PLACEMENTS),
    slogan: z.string().trim().min(1).max(CAPER_LIMITS.slogan).optional(),
    subtitle: z.string().trim().min(1).max(CAPER_LIMITS.subtitle).optional(),
    // 마크다운 글(GFM: 소제목, 목록, 체크리스트, 인용, 링크 등). 화면은 shared/ui/markdown 이 그린다.
    description: z
      .string()
      .trim()
      .min(1)
      .max(CAPER_LIMITS.description)
      .optional(),
    // 언제 하는지(선택). 날짜와 그 지역 시각(schedule.ts).
    schedule: caperScheduleSchema.optional(),
    // 첫 장이 표지다. 목록과 링크 미리보기에도 첫 장을 쓴다.
    images: z.array(caperImageSchema).max(CAPER_LIMITS.images),
    status: caperStatusSchema,
    // 모집 인원(만든 사람 포함). 없으면 제한 없음(recruit.ts).
    capacity: z
      .int()
      .min(CAPER_CAPACITY.min)
      .max(CAPER_CAPACITY.max)
      .optional(),
    joinPolicy: z.enum(JOIN_POLICIES),
    crew: z
      .array(crewMemberSchema)
      .refine((crew) => crew.some((member) => member.role === "owner"), {
        message: "만든 사람이 있어야 합니다.",
      }),
    createdAt: z.iso.datetime(),
  })
  .refine(
    ({ capacity, crew }) => capacity === undefined || crew.length <= capacity,
    { message: "crew 가 모집 인원보다 많습니다.", path: ["crew"] },
  );
