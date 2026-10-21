import {
  type CreateCaperFormValues,
  EMPTY_CREATE_CAPER_FORM,
} from "@/entities/caper";
import { findCaperFixture } from "@/entities/caper/fixtures";
import type { PreviewCase } from "@/views/preview";

const toTheMoon = findCaperFixture("to-the-moon")?.caper;

/** 만들기 편집기 미리보기 케이스. 값은 편집기에 처음 들어 있는 초안이다. */
export const NEW_CAPER_CASES: readonly (PreviewCase & {
  values: CreateCaperFormValues;
})[] = [
  {
    key: "empty",
    label: "빈 편집기",
    note: "처음 연 모습. 만들기를 누르면 제목 오류가 보인다",
    values: EMPTY_CREATE_CAPER_FORM,
  },
  {
    key: "filled",
    label: "다 쓴 편집기",
    note: "To the Moon 내용으로 채운 모습",
    values: {
      title: toTheMoon?.title ?? "",
      slogan: toTheMoon?.slogan ?? "",
      subtitle: toTheMoon?.subtitle ?? "",
      description: toTheMoon?.description ?? "",
    },
  },
];

export function findNewCaperCase(key: string) {
  return NEW_CAPER_CASES.find((previewCase) => previewCase.key === key);
}
