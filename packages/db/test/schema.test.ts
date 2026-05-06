import { describe, expect, it } from "vitest";
import { getTableName } from "drizzle-orm";

import { roomApplications, rooms, schema } from "../src/index.js";

describe("db schema", () => {
  it("exports the core MVP tables", () => {
    expect(Object.keys(schema).sort()).toEqual([
      "profiles",
      "roomApplications",
      "rooms",
      "users"
    ]);
  });

  it("uses room-facing table names for recruitment and applications", () => {
    expect(getTableName(rooms)).toBe("rooms");
    expect(getTableName(roomApplications)).toBe("room_applications");
  });
});
