import type { Caper, CaperViewer } from "@/entities/caper";
import { findCaperFixture } from "@/entities/caper/fixtures";
import type { PreviewCase } from "@/views/preview";

const caperOf = (key: string): Caper => {
  const fixture = findCaperFixture(key);
  if (fixture === undefined) throw new Error(`Unknown caper fixture: ${key}`);
  return fixture.caper;
};

/** 참여하기 미리보기 케이스. 링크를 받은 사람이 보는 프로젝트 페이지와 처음 상태다. */
export const JOIN_CASES: readonly (PreviewCase & {
  caper: Caper;
  viewer: CaperViewer;
})[] = [
  {
    key: "instant",
    label: "바로 확정",
    note: "To the Moon(6명 중 3명). 참여하기 → 이름 → 참여 중(with에 내 칸), 나가기",
    caper: caperOf("to-the-moon"),
    viewer: { role: "guest" },
  },
  {
    key: "approval",
    label: "승인 후 확정",
    note: "첫 번째 김장(인원 제한 없음). 참여하기 → 이름 → 승인 기다림, 신청 취소",
    caper: caperOf("no-image"),
    viewer: { role: "guest" },
  },
  {
    key: "full",
    label: "마감",
    note: "긴 글(2명 중 2명). 버튼 없이 다 찼다는 문장만",
    caper: caperOf("long-text"),
    viewer: { role: "guest" },
  },
  {
    key: "pending",
    label: "승인 기다림",
    note: "첫 번째 김장에 신청한 뒤. 신청 취소",
    caper: caperOf("no-image"),
    viewer: { role: "pending" },
  },
  {
    key: "member",
    label: "참여 중",
    note: "To the Moon에 지아로 들어와 있음(내 칸에 나). 나가기",
    caper: caperOf("to-the-moon"),
    viewer: { role: "member", crewId: "jia" },
  },
];

export function findJoinCase(key: string) {
  return JOIN_CASES.find((previewCase) => previewCase.key === key);
}
