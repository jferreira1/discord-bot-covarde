import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ClientInterface } from "../utils/interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Passa a música. ⏭"),
  run: async (client: ClientInterface, interaction: CommandInteraction) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) return await interaction.editReply("Não está tocando nada...");
    queue.skip();
    await interaction.editReply(`A música anterior foi passada.`);
  },
};
