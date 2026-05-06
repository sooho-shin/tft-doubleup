import { servers } from "@tft-doubleup/domain";
import { Hono } from "hono";

export const app = new Hono();

app.get("/health", (c) => {
  return c.json({
    defaultServer: servers[0],
    status: "ok",
    service: "tft-doubleup-api"
  });
});

export type ApiApp = typeof app;
