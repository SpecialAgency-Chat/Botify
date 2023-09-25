type Config = {
  captchaMethod: "recaptcha" | "turnstile";
  captchaPublicKey: string;
  redirectUri: string;
}

const config: Config = {
  "captchaMethod": "turnstile", // recaptcha, turnstile
  "captchaPublicKey": "0x4AAAAAAAKAAAA",
  "redirectUri": "https://example.com/callback"
} as const;

export default config;