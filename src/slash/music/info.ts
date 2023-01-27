import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayerProgressbarOptions } from "discord-player";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { ClientInterface } from "@interfaces/Client.interface";

interface PlayerProgressBarOptions extends PlayerProgressbarOptions {
  queue?: boolean;
}

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Mostra informações da música tocando. 🔍"),
  run: async (client: ClientInterface, interaction: CommandInteraction) => {
    if (!client.player || !interaction.guildId || !interaction.isCommand())
      return await interaction.editReply("Ih mané, alguma coisa deu errado.");
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) return await interaction.editReply("A lista está vazia.");
    let barOptions: PlayerProgressBarOptions = {
      length: 19,
      queue: false,
    };
    let bar = queue.createProgressBar(barOptions);
    const song = queue.current;
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setThumbnail(song.thumbnail)
          .setDescription(
            `Tocando: \n**[${song.title}](${song.url})**\n` + bar
          ),
      ],
    });
  },
};
