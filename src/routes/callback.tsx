import { Bindings } from "@/interfaces";
import Config from "@/../config";
import { Hono } from "hono";
import { html } from "hono/html";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "hono/jsx";

const router = new Hono<Bindings>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = (props: { children: any }) => {
  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>Botify</title>
        <link rel="stylesheet" href="/assets/style.css" />
        ${Config.captchaMethod === "recaptcha" ? '<script src="https://www.google.com/recaptcha/api.js" async defer></script>':
        Config.captchaMethod === "turnstile" ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>':''}
        <script src="/assets/script.js" async defer></script>
      </head>
      <body>
        <div class="container">
          ${props.children}
        </div>
      </body>
    </html>
  `;
}


const ProceedContent = (props: { code: string }) => (
  <Layout>
    <form>
      <div class={Config.captchaMethod === "recaptcha" ? "g-recaptcha":"cf-turnstile"} data-sitekey={Config.captchaPublicKey} data-callback="onSuccess"></div>
      <input type="hidden" name="code" id="authcode" value={props.code} />
    </form>
  </Layout>
);

const SuccessContent = () => (
  <Layout>
    <h1>Success!</h1>
    <script>
      {`setTimeout(() => {
        window.close();
      }, 10000);`}
    </script>
  </Layout>
);



router.get("/", (c) => {
  if (!c.req.query("code")) return c.text("No code provided");
  
  return c.html(<ProceedContent code={c.req.query("code")!} />);
});

router.get("/success", (c) => {
  return c.html(<SuccessContent />);
});

export default router;