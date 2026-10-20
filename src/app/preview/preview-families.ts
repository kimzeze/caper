import { CAPER_FIXTURES } from "@/entities/caper/fixtures";
import type { PreviewFamily } from "@/views/preview";

const fixtureCases = CAPER_FIXTURES.map(({ key, label, note }) => ({
  key,
  label,
  note,
}));

/** /preview 목록에 보이는 미리보기 묶음. 화면을 만들면 여기에 묶음을 더한다. */
export const PREVIEW_FAMILIES: readonly PreviewFamily[] = [
  {
    key: "capers",
    label: "caper 데이터",
    description:
      "고정 데이터를 화면 순서대로 그대로 보여 줍니다. 디자인 전에 들어갈 내용을 확인합니다.",
    basePath: "/preview/capers",
    cases: fixtureCases,
  },
];

export function findPreviewFamily(key: string): PreviewFamily {
  const family = PREVIEW_FAMILIES.find((value) => value.key === key);
  if (family === undefined) throw new Error(`Unknown preview family: ${key}`);
  return family;
}
