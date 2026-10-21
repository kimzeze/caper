import type { Caper } from "./types";

// 몇 명을 모으고 참여를 어떻게 확정하는지. 인원은 만든 사람을 넣은 전체 수다(6명 = 나 + 5명).
// 인원이 없으면 제한 없이 받는다. 참여하기 화면은 이 값을 보고 마감·승인 기다림을 정한다.

export const CAPER_CAPACITY = { min: 2, max: 100 } as const;

// instant: 참여하기를 누르면 바로 with에 들어간다. approval: 만든 사람이 승인해야 들어간다.
export const JOIN_POLICIES = ["instant", "approval"] as const;

export type JoinPolicy = (typeof JOIN_POLICIES)[number];

export const JOIN_POLICY_LABEL: Record<JoinPolicy, string> = {
  instant: "바로 확정",
  approval: "승인 후 확정",
};

/** 받는 중(open), 인원이 다 참(full), 끝난 프로젝트라 더 받지 않음(closed). */
export type RecruitState = "open" | "full" | "closed";

export function recruitState({
  status,
  capacity,
  crew,
}: Pick<Caper, "status" | "capacity" | "crew">): RecruitState {
  if (status === "done") return "closed";
  return capacity !== undefined && crew.length >= capacity ? "full" : "open";
}

/** 모인 사람 수: 인원이 있으면 "3/6명", 없으면 "3명". */
export function formatHeadcount({
  capacity,
  crew,
}: Pick<Caper, "capacity" | "crew">): string {
  return capacity === undefined
    ? `${crew.length}명`
    : `${crew.length}/${capacity}명`;
}

/** 남은 자리. 제한 없음이면 undefined. */
export function seatsLeft({
  capacity,
  crew,
}: Pick<Caper, "capacity" | "crew">): number | undefined {
  return capacity === undefined
    ? undefined
    : Math.max(capacity - crew.length, 0);
}
