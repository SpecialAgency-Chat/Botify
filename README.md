# Botify
Discord Verification Bot with Linked Roles (with Cloudflare Workers)

## Quickstart
1. `pnpm install`
2. Copy `.dev.vars.example` to `.dev.vars` and `config.ts.example` to `config.ts`
3. Create a bot and put information in ``.dev.vars`
4. Create ReCAPTCHA key and put information in `.dev.vars` and `config.ts`
5. Rename `wrangler.toml`'s `name` prop
6. Put `.dev.vars` content to CF Workers Env through `pnpm wrangler secret put`
7. `pnpm build`
8. `pnpm register`
9. `pnpm release`