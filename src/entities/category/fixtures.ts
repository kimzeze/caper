import { type Category, categorySchema } from "./schema";

// 화면 미리보기(/preview)용 고정 데이터. app/preview 에서만 import한다(index.ts 로 내보내지 않는다).
// caper 고정 데이터의 categoryId 가 여기 id 를 가리킨다. 마지막 것은 이름 한도(20자)에 맞춘 긴 이름이다.
export const CATEGORY_FIXTURES: readonly Category[] = [
  { id: "water-rocket", name: "물로켓 시리즈" },
  { id: "family", name: "가족 행사" },
  { id: "space", name: "우주 덕질" },
  { id: "long-name", name: "동네 골목 끝까지 가 보는 여름 탐험" },
].map((category) => categorySchema.parse(category));

export function findCategoryFixture(
  id: string | undefined,
): Category | undefined {
  return CATEGORY_FIXTURES.find((category) => category.id === id);
}
