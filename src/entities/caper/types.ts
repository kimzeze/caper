import type { z } from "zod";

import type {
  caperSchema,
  caperStatusSchema,
  crewMemberSchema,
  posterSchema,
} from "./schema";

export type Caper = z.infer<typeof caperSchema>;
export type CaperStatus = z.infer<typeof caperStatusSchema>;
export type Poster = z.infer<typeof posterSchema>;
export type CrewMember = z.infer<typeof crewMemberSchema>;
