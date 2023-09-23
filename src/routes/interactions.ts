import { Hono } from "hono";
import { verifyDiscordRequest } from "@/tools/verifyDiscordRequest";
import { getLogger } from "@/logger";
import {
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponsePong,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10";
import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10";
import { Command, Bindings } from "@/interfaces";
import { Ping } from "@/commands";

const commands = new Map<string, Command>();
commands.set("ping", new Ping());

const app = new Hono<Bindings>();
const logger = getLogger("Interactions");

app.all("/", async (c) => {
  logger.debug("Received request");
  logger.trace(c);
  const { isValid, interaction } = await verifyDiscordRequest(c);
  if (!isValid) {
    logger.warn("Invalid request");
    c.status(401);
    return c.text("Invalid request");
  }

  if (interaction.type === InteractionType.Ping) {
    return c.json<APIInteractionResponsePong>({
      type: InteractionResponseType.Pong,
    });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    if (isChatInputApplicationCommandInteraction(interaction)) {
      logger.info("Received command");
      const commandName = interaction.data.name;
      const command = commands.get(commandName);
      if (!command) {
        logger.warn("Command not found");
        return c.json<APIInteractionResponseChannelMessageWithSource>({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Command not found",
            flags: MessageFlags.Ephemeral,
          },
        });
      }
      logger.info("Executing command");
      if (!c.env) throw new Error("Missing env");
      const response = await command.execute(interaction, c.env);
      logger.info("Command executed");
      return c.json<APIInteractionResponseChannelMessageWithSource>(response);
    }
  }
});

export default app;