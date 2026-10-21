import type { z } from "zod";

import type {
  caperImageSchema,
  caperSchema,
  caperStatusSchema,
  crewMemberSchema,
} from "./schema";

export type Caper = z.infer<typeof caperSchema>;
export type CaperStatus = z.infer<typeof caperStatusSchema>;
export type CaperImage = z.infer<typeof caperImageSchema>;
export type CrewMember = z.infer<typeof crewMemberSchema>;
export type { CaperSchedule } from "./schedule";
