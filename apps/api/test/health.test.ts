import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

describe("GET /health", () => {
  it("returns API health status", async () => {
    const response = await app.request("/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      defaultServer: "KR",
      status: "ok",
      service: "tft-doubleup-api"
    });
  });
});
