import {
  type CreateCaperFormValues,
  EMPTY_CREATE_CAPER_FORM,
  imageUrl,
} from "@/entities/caper";
import { findCaperFixture } from "@/entities/caper/fixtures";
import type { Category } from "@/entities/category";
import { CATEGORY_FIXTURES } from "@/entities/category/fixtures";
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
  coverShade: true,
  titlePosition: null,
  categoryId: toTheMoon?.categoryId ?? "",
  date: toTheMoon?.schedule?.date ?? "",
  startTime: toTheMoon?.schedule?.start ?? "",
  endTime: toTheMoon?.schedule?.end ?? "",
  capacityMode: toTheMoon?.capacity === undefined ? "unlimited" : "limited",
  capacity: toTheMoon?.capacity?.toString() ?? "",
  joinPolicy: toTheMoon?.joinPolicy ?? "instant",
};

// 카테고리가 많을 때(고르기 그릇에서 찾기·스크롤을 본다). 고정 데이터 넷 + 흔한 이름들.
const MANY_CATEGORIES: readonly Category[] = [
  ...CATEGORY_FIXTURES,
  ...[
    "주말 실험",
    "동네 산책",
    "생일 준비",
    "캠핑",
    "보드게임 밤",
    "독서 모임",
    "요리 도전",
    "영화 마라톤",
    "여름 여행",
    "운동 같이",
  ].map((name, index) => ({ id: `many-${index + 1}`, name })),
];

export const NEW_CAPER_CASES: readonly (PreviewCase & {
  values: CreateCaperFormValues;
  photos: readonly { id: string; src: string }[];
  categories: readonly Category[];
})[] = [
  {
    key: "empty",
    label: "빈 편집기",
    note: "처음 연 모습(카테고리 없음, 만들기 버튼만). 만들기를 누르면 제목 오류가 보인다",
    values: EMPTY_CREATE_CAPER_FORM,
    photos: [],
    categories: [],
  },
  {
    key: "filled",
    label: "다 쓴 편집기",
    note: "To the Moon 글로 채운 모습(사진 없음, 카테고리 셋 중 물로켓 시리즈)",
    values: toTheMoonValues,
    photos: [],
    categories: CATEGORY_FIXTURES.slice(0, 3),
  },
  {
    key: "with-photos",
    label: "사진 있는 편집기",
    note: "To the Moon 사진 4장과 글. 제목을 사진 위에 체크",
    values: { ...toTheMoonValues, titlePlacement: "over" },
    photos: toTheMoonPhotos,
    categories: CATEGORY_FIXTURES.slice(0, 3),
  },
  {
    key: "many-categories",
    label: "카테고리 많음",
    note: "카테고리 열넷. 칸을 누르면 고르기 그릇(데스크탑 팝오버, 폰 아래 시트)에서 찾고 고르거나 새로 만든다",
    values: toTheMoonValues,
    photos: [],
    categories: MANY_CATEGORIES,
  },
];

export function findNewCaperCase(key: string) {
  return NEW_CAPER_CASES.find((previewCase) => previewCase.key === key);
}
