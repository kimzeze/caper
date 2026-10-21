import { z } from "zod";

// caper 하나의 모양. 화면, Server Action, DB(supabase/migrations), iOS 앱이 이 규칙을 따른다.
// 프로젝트 페이지의 내용 순서는 사진(첫 장이 표지) → 제목 → 슬로건 → 부제 → 설명이다.

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

export const crewMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(20),
  role: z.enum(CREW_ROLES),
});

export const CAPER_LIMITS = {
  title: 40,
  slogan: 60,
  subtitle: 60,
  description: 2000,
  images: 10,
} as const;

export const caperSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(CAPER_LIMITS.title),
  titlePlacement: z.enum(TITLE_PLACEMENTS),
  slogan: z.string().trim().min(1).max(CAPER_LIMITS.slogan).optional(),
  subtitle: z.string().trim().min(1).max(CAPER_LIMITS.subtitle).optional(),
  // 줄바꿈만 살린 일반 글. 마크다운은 쓰지 않는다.
  description: z
    .string()
    .trim()
    .min(1)
    .max(CAPER_LIMITS.description)
    .optional(),
  // 첫 장이 표지다. 목록과 링크 미리보기에도 첫 장을 쓴다.
  images: z.array(caperImageSchema).max(CAPER_LIMITS.images),
  status: caperStatusSchema,
  crew: z
    .array(crewMemberSchema)
    .refine((crew) => crew.some((member) => member.role === "owner"), {
      message: "만든 사람이 있어야 합니다.",
    }),
  createdAt: z.iso.datetime(),
});
