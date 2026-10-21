import {
  type CreateCaperFormValues,
  EMPTY_CREATE_CAPER_FORM,
  imageUrl,
} from "@/entities/caper";
import { findCaperFixture } from "@/entities/caper/fixtures";
import type { PreviewCase } from "@/views/preview";

const toTheMoon = findCaperFixture("to-the-moon")?.caper;

/** 만들기 편집기 미리보기 케이스. 값은 편집기에 처음 들어 있는 초안이다. */
const toTheMoonPhotos = (toTheMoon?.images ?? []).map((image, index) => ({
  id: `${image.path}-${index}`,
  src: imageUrl(image),
}));

const toTheMoonValues: CreateCaperFormValues = {
  title: toTheMoon?.title ?? "",
  slogan: toTheMoon?.slogan ?? "",
  subtitle: toTheMoon?.subtitle ?? "",
  description: toTheMoon?.description ?? "",
  titlePlacement: "below",
  date: toTheMoon?.schedule?.date ?? "",
  startTime: toTheMoon?.schedule?.start ?? "",
  endTime: toTheMoon?.schedule?.end ?? "",
};

export const NEW_CAPER_CASES: readonly (PreviewCase & {
  values: CreateCaperFormValues;
  photos: readonly { id: string; src: string }[];
})[] = [
  {
    key: "empty",
    label: "빈 편집기",
    note: "처음 연 모습. 만들기를 누르면 제목 오류가 보인다",
    values: EMPTY_CREATE_CAPER_FORM,
    photos: [],
  },
  {
    key: "filled",
    label: "다 쓴 편집기",
    note: "To the Moon 글로 채운 모습(사진 없음)",
    values: toTheMoonValues,
    photos: [],
  },
  {
    key: "with-photos",
    label: "사진 있는 편집기",
    note: "To the Moon 사진 4장과 글. 제목을 사진 위에 체크",
    values: { ...toTheMoonValues, titlePlacement: "over" },
    photos: toTheMoonPhotos,
  },
];

export function findNewCaperCase(key: string) {
  return NEW_CAPER_CASES.find((previewCase) => previewCase.key === key);
}
