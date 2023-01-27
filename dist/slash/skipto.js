"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Avança para uma música da lista. ⏭")
        .addNumberOption((option) => option
        .setName("tracknumber")
        .setDescription("Número da música a ser tocada.")
        .setMinValue(1)
        .setRequired(true)),
    run: async (client, interaction) => {
        if (!client.player || !interaction.guildId || !interaction.isCommand())
            return await interaction.editReply("Ih mané, alguma coisa deu errado.");
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || queue.tracks.length <= 0)
            return await interaction.editReply("Não tem nada na fila...");
        const trackNum = interaction.options.getNumber("tracknumber");
        if (trackNum) {
            if (trackNum > queue.tracks.length) {
                return await interaction.editReply("Número especificado é inválido.");
            }
            queue.skipTo(trackNum - 1);
        }
        await interaction.editReply(`A fila foi avançada para a música ${trackNum}!`);
    },
};
