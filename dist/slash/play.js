"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Toque músicas do YouTube, Spotify ou SoundCloud. ▶")
        .addSubcommand((subcommand) => subcommand
        .setName("song")
        .setDescription("Toque música de uma URL.")
        .addStringOption((option) => option
        .setName("url")
        .setDescription("URL da música.")
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName("playlist")
        .setDescription("Toque uma playlist de músicas a partir de uma URL. ▶")
        .addStringOption((option) => option
        .setName("url")
        .setDescription("URL da playlist.")
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName("search")
        .setDescription("Pesquise músicas direto no YouTube. ▶")
        .addStringOption((option) => option
        .setName("searchterms")
        .setDescription("Termos da pesquisa.")
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName("auto")
        .setDescription("Deixa que o pai toca! 😎 (experimental)")),
    run: async (client, interaction) => {
        const noResults = "Sem resultados 😳";
        const rSpotify = new RegExp("spotify.com", "gm");
        const rYoutube = new RegExp("youtube.com", "gm");
        const rSoundcloud = new RegExp("soundcloud.com", "gm");
        const rFacebook = new RegExp("facebook.com", "gm");
        // const rTwitch: RegExp = new RegExp("twitch.com", "gm");
        if (interaction.member instanceof discord_js_1.GuildMember) {
            if (!interaction.member.voice.channel)
                return interaction.editReply("Pô cara, tu tá fora do canal de audio.");
            if (client.player && interaction.guild) {
                const queue = client.player.createQueue(interaction.guild);
                if (!queue.connection)
                    await queue.connect(interaction.member.voice.channel);
                let embed = new discord_js_1.EmbedBuilder();
                if (interaction.options.getSubcommand() === "song") {
                    let url = interaction.options.getString("url");
                    if (url) {
                        let result = null;
                        if (rYoutube.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.YOUTUBE_VIDEO,
                            });
                        }
                        if (rSpotify.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.SPOTIFY_SONG,
                            });
                        }
                        if (rSoundcloud.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.SOUNDCLOUD_TRACK,
                            });
                        }
                        if (rFacebook.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.FACEBOOK,
                            });
                        }
                        if (!result || !result.tracks.length)
                            return noResults;
                        const song = result.tracks[0];
                        queue.addTrack(song);
                        embed
                            .setDescription(`**[${song.title}](${song.url})** foi adicionado na fila.`)
                            .setThumbnail(song.thumbnail)
                            .setFooter({ text: `Duração: ${song.duration}` });
                    }
                }
                if (interaction.options.getSubcommand() === "playlist") {
                    let url = interaction.options.getString("url");
                    if (url) {
                        let result = null;
                        if (rYoutube.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.YOUTUBE_PLAYLIST,
                            });
                        }
                        if (rSpotify.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.SPOTIFY_PLAYLIST,
                            });
                        }
                        if (rSoundcloud.test(url)) {
                            result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.SOUNDCLOUD_PLAYLIST,
                            });
                        }
                        if (!result || !result.tracks.length)
                            return noResults;
                        const playlist = result.playlist;
                        if (!playlist)
                            return;
                        queue.addTracks(result.tracks);
                        embed
                            .setDescription(`**${result.tracks.length}** músicas de **[${playlist.title}](${playlist.url})** foram adicionadas na fila.`)
                            .setThumbnail(playlist.thumbnail);
                    }
                }
                if (interaction.options.getSubcommand() === "search") {
                    let searchterms = interaction.options.getString("searchterms");
                    if (searchterms) {
                        const result = await client.player.search(searchterms, {
                            requestedBy: interaction.user,
                            searchEngine: discord_player_1.QueryType.AUTO,
                        });
                        if (!result.tracks.length)
                            return noResults;
                        const song = result.tracks[0];
                        await queue.addTrack(song);
                        embed
                            .setDescription(`**[${song.title}](${song.url})** foi adicionado na fila.`)
                            .setThumbnail(song.thumbnail)
                            .setFooter({ text: `Duração: ${song.duration}` });
                    }
                }
                if (interaction.options.getSubcommand() === "auto") {
                    if (queue.repeatMode !== discord_player_1.QueueRepeatMode.AUTOPLAY) {
                        queue.setRepeatMode(discord_player_1.QueueRepeatMode.AUTOPLAY);
                        return await interaction.editReply(`Deixa que o pai toca! 😎 - **Automático ativado**!`);
                    }
                    else {
                        queue.setRepeatMode(discord_player_1.QueueRepeatMode.OFF);
                        return await interaction.editReply(`**Automático desativado**!`);
                    }
                }
                if (!queue.playing)
                    await queue.play();
                await interaction.editReply({
                    embeds: [embed],
                });
            }
        }
    },
};
