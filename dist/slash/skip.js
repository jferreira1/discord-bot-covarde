"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("skip")
        .setDescription("Passa a música. ⏭"),
    run: async (client, interaction) => {
        if (!client.player || !interaction.guildId || !interaction.isCommand())
            return await interaction.editReply("Ih mané, alguma coisa deu errado.");
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue)
            return await interaction.editReply("Não está tocando nada...");
        queue.skip();
        await interaction.editReply(`A música anterior foi passada.`);
    },
};
