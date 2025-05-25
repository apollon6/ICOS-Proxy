import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import { oidcAuthMiddleware, getAuth } from "@hono/oidc-auth";
import * as mime from "mime-types";
import { Logger } from "tslog";

import { getObject } from "./lib/icos-client";

const app = new Hono();

/** 認証設定 */
app.use("*", oidcAuthMiddleware());
/** ログ設定 */
const logger = new Logger({ type: "pretty" });
app.use("*", async (c, next) => {
  const auth = await getAuth(c);
  logger.info(
    auth?.email,
    c.req.method,
    c.req.path,
    getConnInfo(c).remote.address
  );
  await next();
});

app.get("/", async (c) => {
  try {
    const result = await getObject("index.html");
    const body = result.Body?.toString("utf-8") ?? "";

    return c.html(body);
  } catch (err) {
    logger.error(err);
    return c.text("Internal Server Error", 500);
  }
});

app.get("/:key", async (c) => {
  const key = c.req.param("key");
  const contentType = mime.lookup(key) || "application/octet-stream";

  try {
    const result = await getObject(key);
    const body = result.Body as Buffer;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    logger.error(err);
    return c.text("Internal Server Error", 500);
  }
});

export default app;
