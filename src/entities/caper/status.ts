import type { CaperStatus } from "./types";

export const CAPER_STATUS_LABEL: Record<CaperStatus, string> = {
  planning: "기획",
  active: "진행",
  done: "완료",
};
