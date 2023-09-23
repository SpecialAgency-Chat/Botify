import { Hono } from "hono";
import { Bindings } from "./interfaces";

const app = new Hono<Bindings>();

app.get("/", (c) => {
  return c.text("Hello World!");
});

export default app;