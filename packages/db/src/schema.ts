import {
  availabilityStatuses,
  discordModes,
  genderVisibilities,
  joinRequestStatuses,
  playStyleTags,
  purposes,
  recruitmentStatuses,
  servers
} from "@tft-doubleup/domain";
import type {
  AvailabilityStatus,
  DiscordMode,
  GenderVisibility,
  JoinRequestStatus,
  PlayStyleTag,
  Purpose,
  RecruitmentStatus,
  Server
} from "@tft-doubleup/domain";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

const enumValues = <T extends readonly [string, ...string[]]>(values: T) =>
  [...values] as [T[0], ...T[number][]];

export const serverEnum = pgEnum("server", enumValues(servers));
export const discordModeEnum = pgEnum("discord_mode", enumValues(discordModes));
export const purposeEnum = pgEnum("purpose", enumValues(purposes));
export const playStyleTagEnum = pgEnum("play_style_tag", enumValues(playStyleTags));
export const availabilityStatusEnum = pgEnum(
  "availability_status",
  enumValues(availabilityStatuses)
);
export const recruitmentStatusEnum = pgEnum(
  "recruitment_status",
  enumValues(recruitmentStatuses)
);
export const joinRequestStatusEnum = pgEnum(
  "join_request_status",
  enumValues(joinRequestStatuses)
);
export const genderVisibilityEnum = pgEnum(
  "gender_visibility",
  enumValues(genderVisibilities)
);

const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  ...timestamps()
});

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    riotId: text("riot_id").notNull(),
    server: serverEnum("server").$type<Server>().notNull().default("KR"),
    doubleUpTier: text("double_up_tier").notNull(),
    genderVisibility: genderVisibilityEnum("gender_visibility")
      .$type<GenderVisibility>()
      .notNull()
      .default("private"),
    discordMode: discordModeEnum("discord_mode").$type<DiscordMode>().notNull(),
    purpose: purposeEnum("purpose").$type<Purpose>().notNull(),
    playStyleTags: text("play_style_tags").array().$type<PlayStyleTag[]>().notNull(),
    availabilityStatus: availabilityStatusEnum("availability_status")
      .$type<AvailabilityStatus>()
      .notNull(),
    bio: text("bio"),
    contactChannel: text("contact_channel").notNull(),
    ...timestamps()
  },
  (table) => [uniqueIndex("profiles_user_id_idx").on(table.userId)]
);

export const rooms = pgTable(
  "rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hostProfileId: uuid("host_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    server: serverEnum("server").$type<Server>().notNull().default("KR"),
    tierMin: text("tier_min").notNull(),
    tierMax: text("tier_max").notNull(),
    purpose: purposeEnum("purpose").$type<Purpose>().notNull(),
    discordMode: discordModeEnum("discord_mode").$type<DiscordMode>().notNull(),
    playStyleTags: text("play_style_tags").array().$type<PlayStyleTag[]>().notNull(),
    availabilityStatus: availabilityStatusEnum("availability_status")
      .$type<AvailabilityStatus>()
      .notNull(),
    description: text("description").notNull(),
    wantedPartner: text("wanted_partner"),
    status: recruitmentStatusEnum("status")
      .$type<RecruitmentStatus>()
      .notNull()
      .default("open"),
    ...timestamps()
  },
  (table) => [
    index("rooms_status_availability_created_at_idx").on(
      table.status,
      table.availabilityStatus,
      table.createdAt
    ),
    index("rooms_purpose_idx").on(table.purpose),
    index("rooms_discord_mode_idx").on(table.discordMode)
  ]
);

export const roomApplications = pgTable(
  "room_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    applicantProfileId: uuid("applicant_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    genderVisibility: genderVisibilityEnum("gender_visibility")
      .$type<GenderVisibility>()
      .notNull()
      .default("private"),
    status: joinRequestStatusEnum("status")
      .$type<JoinRequestStatus>()
      .notNull()
      .default("pending"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    ...timestamps()
  },
  (table) => [
    index("room_applications_room_id_status_idx").on(table.roomId, table.status),
    index("room_applications_applicant_profile_id_status_idx").on(
      table.applicantProfileId,
      table.status
    )
  ]
);

export const schema = {
  users,
  profiles,
  rooms,
  roomApplications
};
