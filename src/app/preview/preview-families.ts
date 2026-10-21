import { CAPER_FIXTURES } from "@/entities/caper/fixtures";
import type { PreviewFamily } from "@/views/preview";

import { JOIN_CASES } from "./join/[case]/cases";
import { NEW_CAPER_CASES } from "./new-caper/[case]/cases";

const fixtureCases = CAPER_FIXTURES.map(({ key, label, note }) => ({
  key,
  label,
  note,
}));

/** /preview 목록에 보이는 미리보기 묶음. 화면을 만들면 여기에 묶음을 더한다. */
export const PREVIEW_FAMILIES: readonly PreviewFamily[] = [
  {
    key: "caper-page",
    label: "프로젝트 페이지",
    description:
      "링크로 받은 사람이 처음 보는 화면입니다. 사진을 옆으로 넘기고, 제목을 사진 위나 아래에 둡니다.",
    basePath: "/preview/caper-page",
    whole: true,
    cases: fixtureCases,
  },
  {
    key: "join",
    label: "참여하기",
    description:
      "링크를 받은 사람이 프로젝트에 들어오는 아래 줄과 만든 사람의 승인 목록입니다. 누르면 미리보기 안에서 상태가 바뀝니다.",
    basePath: "/preview/join",
    whole: true,
    cases: JOIN_CASES.map(({ key, label, note }) => ({ key, label, note })),
  },
  {
    key: "new-caper",
    label: "만들기 편집기",
    description:
      "새 프로젝트를 쓰는 한 화면입니다. 완성 모습 그대로 제목, 슬로건, 부제, 날짜, 설명, 모집 인원을 씁니다.",
    basePath: "/preview/new-caper",
    whole: true,
    cases: NEW_CAPER_CASES.map(({ key, label, note }) => ({
      key,
      label,
      note,
    })),
  },
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
