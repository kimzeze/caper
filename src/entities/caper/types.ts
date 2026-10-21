import type { z } from "zod";

import type {
  caperImageSchema,
  caperSchema,
  caperStatusSchema,
  crewMemberSchema,
  joinRequestSchema,
} from "./schema";

export type Caper = z.infer<typeof caperSchema>;
export type CaperStatus = z.infer<typeof caperStatusSchema>;
export type CaperImage = z.infer<typeof caperImageSchema>;
export type CrewMember = z.infer<typeof crewMemberSchema>;
export type JoinRequest = z.infer<typeof joinRequestSchema>;
export type { CaperSchedule } from "./schedule";
