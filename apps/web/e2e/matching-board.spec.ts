import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });

  expect(overflow, "viewport에 가로 overflow가 있으면 반응형 UI로 볼 수 없습니다.").toBeLessThanOrEqual(1);
}

async function expectDarkInformationUi(page: Page) {
  const luminance = await page.evaluate(() => {
    const parseRgb = (value: string) => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?/);
      if (!match) return null;
      if (match[4] === "0") return null;
      return [Number(match[1]), Number(match[2]), Number(match[3])].map((channel) => channel / 255);
    };
    const parseHex = (value: string) => {
      const hex = value.trim().replace("#", "");
      if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;

      return [0, 2, 4].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
    };

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyBackground = getComputedStyle(document.body).backgroundColor;
    const rootBackgroundToken = rootStyle.getPropertyValue("--background");
    const rootBackground = rootStyle.backgroundColor;
    const rgb = parseHex(rootBackgroundToken) ?? parseRgb(bodyBackground) ?? parseRgb(rootBackground);
    if (!rgb) return 1;

    const linearRgb = rgb.map((channel) => {
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    const [red, green, blue] = linearRgb;

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  });

  expect(
    luminance,
    "Figma 기준은 lolchess.gg에 가까운 다크 정보형 UI입니다. 밝은 스캐폴딩/placeholder UI는 실패해야 합니다."
  ).toBeLessThan(0.18);
}

test.describe("matching board figma-to-web guard", () => {
  test("desktop layout follows the real lobby contract", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "desktop 전용 검증입니다.");

    await page.goto("/");

    await expect(page.getByRole("heading", { name: "더블업 팀원찾기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "방 만들기" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "상세 필터" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "내 신청 상태와 공지" })).toBeVisible();

    await expectDarkInformationUi(page);
    await expectNoHorizontalOverflow(page);

    const applyButtons = page.getByRole("button", { name: "신청하기" });
    await expect(
      applyButtons.first(),
      "Figma 구현 화면은 smoke UI가 아니라 실제 리스트 밀도를 가져야 하므로 신청 액션이 보여야 합니다."
    ).toBeVisible();
    expect(
      await applyButtons.count(),
      "Figma 구현 화면은 smoke UI가 아니라 실제 리스트 밀도를 가져야 하므로 모집 카드가 3개 이상 필요합니다."
    ).toBeGreaterThanOrEqual(3);

    await expect(page.getByText("파트너 추천")).toHaveCount(0);
    await expect(page.getByText("랭킹")).toHaveCount(0);
  });

  test("mobile layout stays inside the viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "mobile 전용 검증입니다.");

    await page.goto("/");

    await expect(page.getByRole("heading", { name: "더블업 팀원찾기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "방 만들기" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectDarkInformationUi(page);

    const primaryAction = page.getByRole("button", { name: "방 만들기" }).first();
    const box = await primaryAction.boundingBox();
    expect(box?.height ?? 0, "모바일 주요 액션 버튼은 터치 가능한 높이를 가져야 합니다.").toBeGreaterThanOrEqual(40);
  });
});
