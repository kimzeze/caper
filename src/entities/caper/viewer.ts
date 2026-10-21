import { recruitState } from "./recruit";
import type { Caper } from "./types";

// 보는 사람과 이 프로젝트의 관계. 로그인한 사람(익명 포함)과 crew·참여 신청을 보고 서버가 정한다.
// member·owner 는 crew 안의 내 id 를 가진다(with 목록에서 내 칸을 알아보려고).
export type CaperViewer =
  | { role: "guest" }
  | { role: "pending" }
  | { role: "member" | "owner"; crewId: string };

// 아래 줄(참여하기)에 무엇을 보일지.
// open: 참여할 수 있음, full: 인원이 다 참, pending: 승인 기다림, member: 참여 중,
// hidden: 줄 없음(만든 사람이거나 끝난 프로젝트. 만든 사람의 승인은 with 구역에서 한다).
export type JoinState = "open" | "full" | "pending" | "member" | "hidden";

export function joinState(
  caper: Pick<Caper, "status" | "capacity" | "crew">,
  viewer: CaperViewer,
): JoinState {
  const recruit = recruitState(caper);
  if (viewer.role === "owner" || recruit === "closed") return "hidden";
  if (viewer.role === "pending" || viewer.role === "member") return viewer.role;
  return recruit;
}
