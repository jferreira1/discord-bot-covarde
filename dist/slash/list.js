"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("list")
        .setDescription("Mostra as músicas na fila. 🔍")
        .addNumberOption((option) => option.setName("page").setDescription("Página da fila.").setMinValue(1)),
    run: async (client, interaction) => {
        if (!client.player || !interaction.isCommand() || !interaction.guildId)
            return await interaction.editReply("Ih mané, alguma coisa deu errado.");
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || queue.tracks.length <= 0) {
            return await interaction.editReply("A lista está vazia.");
        }
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getNumber("page") || 1) - 1;
        if (page > totalPages)
            return await interaction.editReply(`Página inválida. Só tem ${totalPages} páginas.`);
        const queueString = queue.tracks
            .slice(page * 10, page * 10 + 10)
            .map((song, i) => {
            return `**${page * 10 + i + 1}.** [${song.duration}]** ${song.title}** - <@${song.requestedBy.id}>\n`;
        });
        const currentSong = queue.current;
        await interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setDescription(`**Tocando agora:**\n` +
                    (currentSong
                        ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>`
                        : "— *Coé acerola, vai curtir um baile não?* 😎") +
                    `\n\n**Próximas:**\n${queueString.join("")}`)
                    .setFooter({
                    text: `Página ${page + 1} de ${totalPages}`,
                })
                    .setThumbnail(currentSong.thumbnail),
            ],
        });
    },
};
