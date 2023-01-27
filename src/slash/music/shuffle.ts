import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { ClientInterface } from "@interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Embaralha a fila de músicas. 🔀"),
  run: async (
    client: ClientInterface,
    interaction: ChatInputCommandInteraction
  ) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || queue.tracks.length <= 1)
      return await interaction.editReply("Não tem nada para embaralhar...");
    queue.shuffle();
    await interaction.editReply(
      `As ${queue.tracks.length} músicas da fila foram embaralhadas.`
    );
  },
};
