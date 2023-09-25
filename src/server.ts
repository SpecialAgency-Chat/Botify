import { Hono } from "hono";
import { Bindings } from "./interfaces";
import Interactions from "./routes/interactions";
import Config from "../config";
import { serveStatic } from "hono/cloudflare-workers";
import Callback from "./routes/callback";
import CallbackApi from "./routes/callback-api";

const app = new Hono<Bindings>();

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.get("/linked-roles", (c) => {
  return c.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${c.env["DISCORD_CLIENT_ID"]}&redirect_uri=${Config.redirectUri}&response_type=code&scope=identify%20role_connections.write`,
  );
});
app.route("/callback", Callback);
app.route("/callback-api", CallbackApi);

app.get("/static/*", serveStatic({ root: "./" }));
app.route("/interactions", Interactions);

export default app;
