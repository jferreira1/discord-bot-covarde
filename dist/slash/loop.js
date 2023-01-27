"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("loop")
        .setDescription("Deixe em modo de repetição. 🔁")
        .addSubcommand((subcommand) => subcommand.setName("song").setDescription("Repita a música atual."))
        .addSubcommand((subcommand) => subcommand.setName("playlist").setDescription("Repita a playlist")),
    run: async (client, interaction) => {
        if (interaction.member instanceof discord_js_1.GuildMember) {
            if (!interaction.member.voice.channel)
                return await interaction.editReply("Pô cara, tu tá fora do canal de audio.");
            if (!client.player || !interaction.guildId)
                return await interaction.editReply("Ih mané, alguma coisa deu errado.");
            const queue = client.player.getQueue(interaction.guildId);
            if (!queue)
                return await interaction.editReply("Não tem nada tocando...");
            if (interaction.options.getSubcommand() === "song") {
                if (queue.repeatMode !== discord_player_1.QueueRepeatMode.TRACK) {
                    queue.setRepeatMode(discord_player_1.QueueRepeatMode.TRACK);
                    return await interaction.editReply(`Repetição de música **ativado**!`);
                }
                else {
                    queue.setRepeatMode(discord_player_1.QueueRepeatMode.OFF);
                    return await interaction.editReply(`Repetição de música **desativado**!`);
                }
            }
            if (interaction.options.getSubcommand() === "playlist") {
                if (queue.repeatMode !== discord_player_1.QueueRepeatMode.QUEUE) {
                    queue.setRepeatMode(discord_player_1.QueueRepeatMode.QUEUE);
                    return await interaction.editReply(`Repetição de playlist **ativado**!`);
                }
                else {
                    queue.setRepeatMode(discord_player_1.QueueRepeatMode.OFF);
                    return await interaction.editReply(`Repetição de música **desativado**!`);
                }
            }
        }
    },
};
