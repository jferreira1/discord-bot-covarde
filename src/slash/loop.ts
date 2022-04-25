import { SlashCommandBuilder } from "@discordjs/builders";
import { QueueRepeatMode } from "discord-player";
import { CommandInteraction, GuildMember } from "discord.js";
import { ClientInterface } from "../utils/interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Deixe em modo de repetição. 🔁")
    .addSubcommand((subcommand) =>
      subcommand.setName("song").setDescription("Repita a música atual.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("playlist").setDescription("Repita a playlist")
    ),
  run: async (client: ClientInterface, interaction: CommandInteraction) => {
    if (interaction.member instanceof GuildMember) {
      if (!interaction.member.voice.channel)
        return await interaction.editReply(
          "Pô cara, tu tá fora do canal de audio."
        );
      if (!client.player || !interaction.guildId)
        return await interaction.editReply("Ih mané, alguma coisa deu errado.");
      const queue = client.player.getQueue(interaction.guildId);
      if (!queue) return await interaction.editReply("Não tem nada tocando...");

      if (interaction.options.getSubcommand() === "song") {
        if (queue.repeatMode !== QueueRepeatMode.TRACK) {
          queue.setRepeatMode(QueueRepeatMode.TRACK);
          return await interaction.editReply(
            `Repetição de música **ativado**!`
          );
        } else {
          queue.setRepeatMode(QueueRepeatMode.OFF);
          return await interaction.editReply(
            `Repetição de música **desativado**!`
          );
        }
      }
      if (interaction.options.getSubcommand() === "playlist") {
        if (queue.repeatMode !== QueueRepeatMode.QUEUE) {
          queue.setRepeatMode(QueueRepeatMode.QUEUE);
          return await interaction.editReply(
            `Repetição de playlist **ativado**!`
          );
        } else {
          queue.setRepeatMode(QueueRepeatMode.OFF);
          return await interaction.editReply(
            `Repetição de música **desativado**!`
          );
        }
      }
    }
  },
};
