import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { ClientInterface } from "@interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Continua a música. ▶"),
  run: async (
    client: ClientInterface,
    interaction: ChatInputCommandInteraction
  ) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || queue.tracks.length <= 0)
      return await interaction.editReply("Não tem nada para tocar.");
    queue.setPaused(false);
    await interaction.editReply(`— *Deixa os garoto brincar!* 🕺🏼💃🏻`);
  },
};
