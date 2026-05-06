import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { PoolConfig } from "pg";

import * as schema from "./schema.js";

export type CreateDatabaseClientOptions = {
  connectionString?: string;
  poolConfig?: Omit<PoolConfig, "connectionString">;
};

export const resolveDatabaseUrl = (env: NodeJS.ProcessEnv = process.env) => {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize the database client.");
  }

  return databaseUrl;
};

export const createDatabasePool = (options: CreateDatabaseClientOptions = {}) =>
  new Pool({
    ...options.poolConfig,
    connectionString: options.connectionString ?? resolveDatabaseUrl()
  });

export const createDatabaseClient = (options: CreateDatabaseClientOptions = {}) => {
  const pool = createDatabasePool(options);
  const db = drizzle(pool, { schema });

  return { db, pool };
};

export type DatabasePool = ReturnType<typeof createDatabasePool>;
export type DatabaseClient = ReturnType<typeof createDatabaseClient>["db"];
