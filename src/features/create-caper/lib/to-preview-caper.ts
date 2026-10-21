import {
  type Caper,
  type CreateCaperFormValues,
  caperSchema,
  createCaperSchema,
} from "@/entities/caper";

// 미리보기는 저장 전이라 만든 시각을 쓰지 않는다. 화면에 보이지 않는 값이라 고정한다.
const PREVIEW_CREATED_AT = "1970-01-01T00:00:00.000Z";

/** 초안을 프로젝트 페이지로 그릴 caper 로 바꾼다. 초안이 규칙에 맞지 않으면(제목 없음 등) undefined. */
export function toPreviewCaper(
  draft: CreateCaperFormValues,
): Caper | undefined {
  const form = createCaperSchema.safeParse(draft);
  if (!form.success) return undefined;
  const { title, slogan, subtitle, description } = form.data;

  const caper = caperSchema.safeParse({
    id: "draft",
    title,
    titlePlacement: "below",
    slogan: slogan || undefined,
    subtitle: subtitle || undefined,
    description: description || undefined,
    images: [],
    status: "planning",
    crew: [{ id: "me", name: "나", role: "owner" }],
    createdAt: PREVIEW_CREATED_AT,
  });
  return caper.success ? caper.data : undefined;
}
