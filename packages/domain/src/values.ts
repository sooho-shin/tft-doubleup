export const servers = ["KR"] as const;

export const discordModes = ["talk", "listen_only", "unavailable"] as const;

export const purposes = [
  "rank_up",
  "top4",
  "casual",
  "practice",
  "beginner_friendly",
  "fixed_duo",
  "mission_event"
] as const;

export const playStyleTags = [
  "standard",
  "reroll",
  "tempo",
  "win_streak",
  "loss_streak",
  "meta",
  "flex",
  "top4",
  "first_place",
  "item_consult",
  "positioning_review",
  "communicative",
  "quiet"
] as const;

export const availabilityStatuses = [
  "available_now",
  "one_game",
  "two_games",
  "in_game"
] as const;

export const recruitmentStatuses = ["open", "matched", "closed"] as const;

export const joinRequestStatuses = [
  "pending",
  "accepted",
  "rejected",
  "cancelled"
] as const;

export const genderVisibilities = ["male", "female", "private"] as const;
