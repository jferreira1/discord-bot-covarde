import { Client as ClientDiscordJS, Collection } from "discord.js";
import { Player } from "discord-player";

export interface ClientInterface extends ClientDiscordJS {
  slashCommands?: Collection<unknown, unknown>;
  player?: Player;
}
