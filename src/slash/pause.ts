import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { ClientInterface } from "../utils/interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Suspende a música. ⏸"),
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

      if (queue.setPaused(true)) {
        await interaction.editReply(
          `💥🔫 — *Calma gente, hoje é no amor!* Usa o **"/resume"** para continuar a música.`
        );
      } else {
        `Por algum motivo deu errado, melhor tentar denovo.`;
      }
    }
  },
};
