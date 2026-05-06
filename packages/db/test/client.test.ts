import { describe, expect, it } from "vitest";

import { createDatabaseClient, resolveDatabaseUrl } from "../src/index.js";

describe("database client", () => {
  it("requires DATABASE_URL when no explicit connection string is provided", () => {
    expect(() => resolveDatabaseUrl({})).toThrow("DATABASE_URL is required");
  });

  it("initializes a Drizzle client with an explicit PostgreSQL connection string", async () => {
    const { db, pool } = createDatabaseClient({
      connectionString: "postgres://postgres:postgres@localhost:5432/tft_doubleup"
    });

    expect(db).toBeDefined();
    await pool.end();
  });
});
