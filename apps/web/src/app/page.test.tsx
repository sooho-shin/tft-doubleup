import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the root matching board route", () => {
    const html = renderToString(<HomePage />);

    expect(html).toContain("더블업 팀원찾기");
    expect(html).toContain("지금 모집 중인 파트너");
    expect(html).toContain("방 만들기");
  });
});
