import { Interaction } from "discord.js";
import { ClientInterface } from "./Client.interface";

export interface SlashCommand {
  data?: any;
  run?: (client: ClientInterface, interaction: Interaction) => Promise<any>;
}
