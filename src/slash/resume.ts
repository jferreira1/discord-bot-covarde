import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ClientInterface } from "../utils/interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Continua a música. ▶"),
  run: async (client: ClientInterface, interaction: CommandInteraction) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || queue.tracks.length <= 0)
      return await interaction.editReply("Não tem nada para tocar.");
    queue.setPaused(false);
    await interaction.editReply(`— *Deixa os garoto brincar!* 🕺🏼💃🏻`);
  },
};
