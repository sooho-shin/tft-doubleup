import { describe, expect, it } from "vitest";

import {
  CreateJoinRequestSchema,
  CreateRecruitmentPostSchema,
  JoinRequestInputSchema,
  RecruitmentPostInputSchema,
  RecruitmentPostSchema,
  ServerSchema,
  UserProfileInputSchema,
  UserProfileSchema,
  domainLabels,
  isAvailableNowStatus
} from "../src/index";

const now = "2026-05-06T00:00:00.000+09:00";

describe("@tft-doubleup/domain", () => {
  it("MVP 서버는 KR만 허용한다", () => {
    expect(ServerSchema.parse("KR")).toBe("KR");
    expect(() => ServerSchema.parse("NA")).toThrow();
    expect(domainLabels.server.KR).toBe("한국 서버");
  });

  it("사용자 프로필의 성별 공개값 기본값은 비공개다", () => {
    const profile = UserProfileSchema.parse({
      id: "user-1",
      displayName: "더블업유저",
      riotId: "doubleup#KR1",
      doubleUpTier: "Emerald II",
      discordMode: "talk",
      playStyleTags: ["standard", "communicative"],
      purpose: "rank_up",
      availabilityStatus: "available_now",
      contactChannel: "discord:doubleup",
      createdAt: now,
      updatedAt: now
    });

    expect(profile.server).toBe("KR");
    expect(profile.genderVisibility).toBe("private");
  });

  it("모집방 schema에는 예약 시간 필드를 허용하지 않는다", () => {
    const post = RecruitmentPostSchema.strict().safeParse({
      id: "post-1",
      title: "랭크 같이 올릴 파트너 구합니다",
      authorId: "user-1",
      tierMin: "Platinum IV",
      tierMax: "Diamond I",
      purpose: "rank_up",
      availableNow: true,
      availabilityStatus: "two_games",
      discordMode: "talk",
      playStyleTags: ["standard", "top4"],
      description: "지금 바로 두 판 가능해요.",
      createdAt: now,
      updatedAt: now,
      scheduledAt: now
    });

    expect(post.success).toBe(false);
  });

  it("방 생성 입력값은 KR, 모집중, 지금 가능 여부를 기본 도메인 값으로 만든다", () => {
    const post = CreateRecruitmentPostSchema.parse({
      title: " 랭크 같이 올릴 파트너 구합니다 ",
      authorId: "user-1",
      tierMin: "Platinum IV",
      tierMax: "Diamond I",
      purpose: "rank_up",
      availabilityStatus: "two_games",
      discordMode: "talk",
      playStyleTags: ["standard", "top4"],
      description: "지금 바로 두 판 가능해요."
    });

    expect(post.title).toBe("랭크 같이 올릴 파트너 구합니다");
    expect(post.server).toBe("KR");
    expect(post.authorGenderVisibility).toBe("private");
    expect(post.availableNow).toBe(true);
    expect(post.status).toBe("open");
  });

  it("현재 플레이 중 상태는 지금 가능으로 계산하지 않는다", () => {
    expect(isAvailableNowStatus("available_now")).toBe(true);
    expect(isAvailableNowStatus("one_game")).toBe(true);
    expect(isAvailableNowStatus("two_games")).toBe(true);
    expect(isAvailableNowStatus("in_game")).toBe(false);
  });

  it("신청 입력값의 성별 공개값과 상태 기본값을 검증한다", () => {
    const request = CreateJoinRequestSchema.parse({
      postId: "post-1",
      requesterId: "user-2",
      message: " 지금 신청 가능할까요? "
    });

    expect(request.message).toBe("지금 신청 가능할까요?");
    expect(request.requesterGenderVisibility).toBe("private");
    expect(request.status).toBe("pending");
  });

  it("사용자 프로필 입력값의 enum과 필수 문자열을 Zod로 검증한다", () => {
    const validProfileInput = {
      displayName: "더블업유저",
      riotId: "doubleup#KR1",
      doubleUpTier: "Emerald II",
      discordMode: "talk",
      playStyleTags: ["standard", "communicative"],
      purpose: "rank_up",
      availabilityStatus: "available_now",
      contactChannel: "discord:doubleup"
    };

    expect(UserProfileInputSchema.safeParse(validProfileInput).success).toBe(
      true
    );
    expect(
      UserProfileInputSchema.safeParse({
        ...validProfileInput,
        discordMode: "voice_required"
      }).success
    ).toBe(false);
    expect(
      UserProfileInputSchema.safeParse({
        ...validProfileInput,
        displayName: " "
      }).success
    ).toBe(false);
  });

  it("모집방 입력값은 플레이 스타일 태그 개수와 MVP 상태값을 검증한다", () => {
    const validPostInput = {
      title: "랭크 같이 올릴 파트너 구합니다",
      authorId: "user-1",
      tierMin: "Platinum IV",
      tierMax: "Diamond I",
      purpose: "rank_up",
      availabilityStatus: "two_games",
      discordMode: "talk",
      playStyleTags: ["standard", "top4"],
      description: "지금 바로 두 판 가능해요."
    };

    expect(RecruitmentPostInputSchema.safeParse(validPostInput).success).toBe(
      true
    );
    expect(
      RecruitmentPostInputSchema.safeParse({
        ...validPostInput,
        playStyleTags: []
      }).success
    ).toBe(false);
    expect(
      RecruitmentPostInputSchema.safeParse({
        ...validPostInput,
        availabilityStatus: "scheduled"
      }).success
    ).toBe(false);
  });

  it("완성된 도메인 엔티티의 timestamp와 신청 메시지 길이를 검증한다", () => {
    expect(
      RecruitmentPostSchema.safeParse({
        id: "post-1",
        title: "랭크 같이 올릴 파트너 구합니다",
        authorId: "user-1",
        tierMin: "Platinum IV",
        tierMax: "Diamond I",
        purpose: "rank_up",
        availableNow: true,
        availabilityStatus: "two_games",
        discordMode: "talk",
        playStyleTags: ["standard", "top4"],
        description: "지금 바로 두 판 가능해요.",
        createdAt: "2026-05-06",
        updatedAt: now
      }).success
    ).toBe(false);

    expect(
      JoinRequestInputSchema.safeParse({
        postId: "post-1",
        requesterId: "user-2",
        message: ""
      }).success
    ).toBe(false);
  });
});
