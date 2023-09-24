import { Env } from "@/interfaces";
import { getLogger } from "@/logger";
import { APIUser, Routes } from "discord-api-types/v10";
import Config from "@/../config";
import { DiscordSnowflake } from "@sapphire/snowflake";

const logger = getLogger("Assign");

export async function completeAuth(code: string, env: Env) {
  const tokenResponse = await fetch(`https://discord.com/api/v10${Routes.oauth2TokenExchange()}`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: Config.redirectUri,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const { access_token } = await tokenResponse.json();
  logger.debug(`Access token: ${access_token}`);
  const userResponse = await fetch(`https://discord.com/api/v10${Routes.user()}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const user: APIUser = await userResponse.json();

  logger.debug(user);

  await fetch(`https://discord.com/api/v10${Routes.userApplicationRoleConnection(env.DISCORD_CLIENT_ID)}`, {
    method: "PUT",
    body: JSON.stringify({
      platform_name: "Botify",
      metadata: {
        birthday: new Date(Number(DiscordSnowflake.deconstruct(user.id).timestamp)).toISOString(),
      }
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return true;
}