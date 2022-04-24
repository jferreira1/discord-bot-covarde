import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ClientInterface } from "../utils/interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("quit")
    .setDescription("Mata o bot e limpa a fila. 😨"),
  run: async (client: ClientInterface, interaction: CommandInteraction) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) return await interaction.editReply("A fila está vazia.");
    queue.destroy(true);
    await interaction.editReply("Valeu rapaziada! 🤙🏻");
  },
};
