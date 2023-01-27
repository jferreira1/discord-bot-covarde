"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("info")
        .setDescription("Mostra informações da música tocando. 🔍"),
    run: async (client, interaction) => {
        if (!client.player || !interaction.guildId || !interaction.isCommand())
            return await interaction.editReply("Ih mané, alguma coisa deu errado.");
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue)
            return await interaction.editReply("A lista está vazia.");
        let barOptions = {
            length: 19,
            queue: false,
        };
        let bar = queue.createProgressBar(barOptions);
        const song = queue.current;
        await interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setThumbnail(song.thumbnail)
                    .setDescription(`Tocando: \n**[${song.title}](${song.url})**\n` + bar),
            ],
        });
    },
};
