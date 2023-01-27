"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("resume")
        .setDescription("Continua a música. ▶"),
    run: async (client, interaction) => {
        if (!client.player || !interaction.guildId || !interaction.isCommand())
            return await interaction.editReply("Ih mané, alguma coisa deu errado.");
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || queue.tracks.length <= 0)
            return await interaction.editReply("Não tem nada para tocar.");
        queue.setPaused(false);
        await interaction.editReply(`— *Deixa os garoto brincar!* 🕺🏼💃🏻`);
    },
};
