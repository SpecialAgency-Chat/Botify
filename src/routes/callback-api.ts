import { completeAuth } from "@/tools/assign";
import { Hono } from "hono";
import Config from "@/../config";
import { Bindings } from "@/interfaces";
import { getLogger } from "@/logger";

const router = new Hono<Bindings>();

const logger = getLogger("CallbackApi");

router.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.code || !body.token) {
    return c.json({ error: "Missing code or token" });
  }

  logger.info("Received callback");

  let url;

  if (Config.captchaMethod === "recaptcha") {
    url = "https://www.google.com/recaptcha/api/siteverify";
  } else if (Config.captchaMethod === "turnstile") {
    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  } else {
    throw new Error("Invalid captcha method");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret: c.env.CAPTCHA_SECRET_KEY,
      response: body.token,
    })
  });

  const json = await res.json();

  logger.trace(json);

  if (!json.success) {
    return c.json({ error: "Invalid captcha" });
  }

  await completeAuth(body.code, c.env);

  return c.json({ success: true });
});

export default router;