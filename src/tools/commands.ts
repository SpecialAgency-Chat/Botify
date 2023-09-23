import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "Ping",
    description: "Ping the bot",
    description_localizations: {
      ja: "ボットにPingを送信します",
    }
  }
] as const;
export default commands;