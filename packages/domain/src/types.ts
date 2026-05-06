import type { z } from "zod";

import type {
  AvailabilityStatusSchema,
  CreateJoinRequestSchema,
  CreateRecruitmentPostSchema,
  DiscordModeSchema,
  GenderVisibilitySchema,
  JoinRequestInputSchema,
  JoinRequestSchema,
  JoinRequestStatusSchema,
  PlayStyleTagSchema,
  PurposeSchema,
  RecruitmentPostInputSchema,
  RecruitmentPostSchema,
  RecruitmentStatusSchema,
  ServerSchema,
  UserProfileInputSchema,
  UserProfileSchema
} from "./schemas.js";

export type Server = z.infer<typeof ServerSchema>;
export type DiscordMode = z.infer<typeof DiscordModeSchema>;
export type Purpose = z.infer<typeof PurposeSchema>;
export type PlayStyleTag = z.infer<typeof PlayStyleTagSchema>;
export type AvailabilityStatus = z.infer<typeof AvailabilityStatusSchema>;
export type RecruitmentStatus = z.infer<typeof RecruitmentStatusSchema>;
export type JoinRequestStatus = z.infer<typeof JoinRequestStatusSchema>;
export type GenderVisibility = z.infer<typeof GenderVisibilitySchema>;
export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type RecruitmentPostInput = z.input<typeof CreateRecruitmentPostSchema>;
export type CreateRecruitmentPost = z.output<
  typeof CreateRecruitmentPostSchema
>;
export type RecruitmentPostDraft = z.infer<typeof RecruitmentPostInputSchema>;
export type RecruitmentPost = z.infer<typeof RecruitmentPostSchema>;
export type JoinRequestInput = z.input<typeof CreateJoinRequestSchema>;
export type CreateJoinRequest = z.output<typeof CreateJoinRequestSchema>;
export type JoinRequestDraft = z.infer<typeof JoinRequestInputSchema>;
export type JoinRequest = z.infer<typeof JoinRequestSchema>;
