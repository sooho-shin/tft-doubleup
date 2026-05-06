import { z } from "zod";

import {
  availabilityStatuses,
  discordModes,
  genderVisibilities,
  joinRequestStatuses,
  playStyleTags,
  purposes,
  recruitmentStatuses,
  servers
} from "./values.js";

export const ServerSchema = z.enum(servers);
export const DiscordModeSchema = z.enum(discordModes);
export const PurposeSchema = z.enum(purposes);
export const PlayStyleTagSchema = z.enum(playStyleTags);
export const AvailabilityStatusSchema = z.enum(availabilityStatuses);
export const RecruitmentStatusSchema = z.enum(recruitmentStatuses);
export const JoinRequestStatusSchema = z.enum(joinRequestStatuses);
export const GenderVisibilitySchema = z.enum(genderVisibilities);

export const TimestampSchema = z.string().datetime({ offset: true });
export const IdSchema = z.string().min(1);
export const TierSchema = z.string().min(1);
export const DisplayNameSchema = z.string().trim().min(1).max(40);
export const RiotIdSchema = z.string().trim().min(1).max(80);
export const ContactChannelSchema = z.string().trim().min(1).max(120);
export const BioSchema = z.string().trim().max(500);
export const RoomTitleSchema = z.string().trim().min(1).max(80);
export const RoomDescriptionSchema = z.string().trim().min(1).max(1000);
export const JoinRequestMessageSchema = z.string().trim().min(1).max(500);

export const isAvailableNowStatus = (
  status: z.infer<typeof AvailabilityStatusSchema>
) => status !== "in_game";

export const UserProfileInputSchema = z
  .object({
    displayName: DisplayNameSchema,
    riotId: RiotIdSchema,
    server: ServerSchema.default("KR"),
    doubleUpTier: TierSchema,
    genderVisibility: GenderVisibilitySchema.default("private"),
    discordMode: DiscordModeSchema,
    playStyleTags: z.array(PlayStyleTagSchema).max(8),
    purpose: PurposeSchema,
    bio: BioSchema.optional(),
    availabilityStatus: AvailabilityStatusSchema,
    contactChannel: ContactChannelSchema
  })
  .strict();

export const UserProfileSchema = UserProfileInputSchema.extend({
  id: IdSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});

export const RecruitmentPostInputSchema = z
  .object({
    title: RoomTitleSchema,
    authorId: IdSchema,
    authorGenderVisibility: GenderVisibilitySchema.default("private"),
    server: ServerSchema.default("KR"),
    tierMin: TierSchema,
    tierMax: TierSchema,
    purpose: PurposeSchema,
    availabilityStatus: AvailabilityStatusSchema,
    discordMode: DiscordModeSchema,
    playStyleTags: z.array(PlayStyleTagSchema).min(1).max(8),
    description: RoomDescriptionSchema
  })
  .strict();

export const CreateRecruitmentPostSchema = RecruitmentPostInputSchema.transform(
  (input) => ({
    ...input,
    availableNow: isAvailableNowStatus(input.availabilityStatus),
    status: "open" as const
  })
);

export const RecruitmentPostSchema = RecruitmentPostInputSchema.extend({
  id: IdSchema,
  availableNow: z.boolean(),
  status: RecruitmentStatusSchema.default("open"),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});

export const JoinRequestInputSchema = z
  .object({
    postId: IdSchema,
    requesterId: IdSchema,
    requesterGenderVisibility: GenderVisibilitySchema.default("private"),
    message: JoinRequestMessageSchema
  })
  .strict();

export const CreateJoinRequestSchema = JoinRequestInputSchema.transform(
  (input) => ({
    ...input,
    status: "pending" as const
  })
);

export const JoinRequestSchema = JoinRequestInputSchema.extend({
  id: IdSchema,
  status: JoinRequestStatusSchema.default("pending"),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});
