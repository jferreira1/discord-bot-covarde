"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("quit")
        .setDescription("Mata o bot e limpa a fila. 😨"),
    run: async (client, interaction) => {
        if (!client.player || !interaction.guildId || !interaction.isCommand())
            return await interaction.editReply("Ih mané, alguma coisa deu errado.");
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue)
            return await interaction.editReply("A fila está vazia.");
        queue.destroy(true);
        await interaction.editReply("Valeu rapaziada! 🤙🏻");
    },
};
