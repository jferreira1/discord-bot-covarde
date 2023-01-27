import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { ClientInterface } from "@interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Passa a música. ⏭"),
  run: async (
    client: ClientInterface,
    interaction: ChatInputCommandInteraction
  ) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) return await interaction.editReply("Não está tocando nada...");
    queue.skip();
    await interaction.editReply(`A música anterior foi passada.`);
  },
};
