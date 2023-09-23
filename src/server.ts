import { Hono } from "hono";
import { Bindings } from "./interfaces";
import Interactions from "./routes/interactions";

const app = new Hono<Bindings>();

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/interactions", Interactions);

export default app;