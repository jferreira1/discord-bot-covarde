"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("pause")
        .setDescription("Suspende a música. ⏸"),
    run: async (client, interaction) => {
        if (interaction.member instanceof discord_js_1.GuildMember) {
            if (!interaction.member.voice.channel)
                return await interaction.editReply("Pô cara, tu tá fora do canal de audio.");
            if (!client.player || !interaction.guildId)
                return await interaction.editReply("Ih mané, alguma coisa deu errado.");
            const queue = client.player.getQueue(interaction.guildId);
            if (!queue)
                return await interaction.editReply("Não tem nada tocando...");
            if (queue.setPaused(true)) {
                await interaction.editReply(`💥🔫 — *Calma gente, hoje é no amor!* Usa o **"/resume"** para continuar a música.`);
            }
            else {
                `Por algum motivo deu errado, melhor tentar denovo.`;
            }
        }
    },
};
