import {
  type Caper,
  type CreateCaperFormValues,
  caperSchema,
  createCaperSchema,
  toCapacity,
} from "@/entities/caper";

import type { DraftPhoto } from "../model/draft-store";

// 미리보기는 저장 전이라 만든 시각을 쓰지 않는다. 화면에 보이지 않는 값이라 고정한다.
const PREVIEW_CREATED_AT = "1970-01-01T00:00:00.000Z";

/**
 * 초안을 프로젝트 페이지로 그릴 caper 로 바꾼다. 초안이 규칙에 맞지 않으면(제목 없음 등) undefined.
 * 사진 경로는 아직 Storage 가 없어 "draft/<id>" 로 둔다. 화면 주소는 쓰는 쪽이 초안 사진에서 만든다.
 */
export function toPreviewCaper(
  draft: CreateCaperFormValues,
  photos: readonly DraftPhoto[],
): Caper | undefined {
  const form = createCaperSchema.safeParse(draft);
  if (!form.success) return undefined;
  const {
    title,
    slogan,
    subtitle,
    description,
    titlePlacement,
    coverShade,
    categoryId,
    date,
    startTime,
    endTime,
    capacityMode,
    capacity,
    joinPolicy,
  } = form.data;

  const caper = caperSchema.safeParse({
    id: "draft",
    title,
    titlePlacement,
    coverShade,
    categoryId: categoryId || undefined,
    slogan: slogan || undefined,
    subtitle: subtitle || undefined,
    description: description || undefined,
    schedule: date
      ? {
          date,
          start: startTime || undefined,
          end: endTime || undefined,
        }
      : undefined,
    images: photos.map(({ id, width, height }) => ({
      path: `draft/${id}`,
      width,
      height,
    })),
    status: "planning",
    capacity: capacityMode === "limited" ? toCapacity(capacity) : undefined,
    joinPolicy,
    crew: [{ id: "me", name: "나", role: "owner" }],
    createdAt: PREVIEW_CREATED_AT,
  });
  return caper.success ? caper.data : undefined;
}
