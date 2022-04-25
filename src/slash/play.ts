import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { PlayerSearchResult, QueryType, QueueRepeatMode } from "discord-player";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ClientInterface } from "../utils/interfaces/Client.interface";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Toque músicas do YouTube, Spotify ou SoundCloud. ▶")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Toque música de uma URL.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("URL da música.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Toque uma playlist de músicas a partir de uma URL. ▶")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("URL da playlist.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Pesquise músicas direto no YouTube. ▶")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("Termos da pesquisa.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("auto")
        .setDescription("Deixa que o pai toca! 😎 (experimental)")
    ),

  run: async (client: ClientInterface, interaction: CommandInteraction) => {
    const noResults = "Sem resultados 😳";
    const rSpotify: RegExp = new RegExp("spotify.com", "gm");
    const rYoutube: RegExp = new RegExp("youtube.com", "gm");
    const rSoundcloud: RegExp = new RegExp("soundcloud.com", "gm");
    const rFacebook: RegExp = new RegExp("facebook.com", "gm");
    // const rTwitch: RegExp = new RegExp("twitch.com", "gm");
    if (interaction.member instanceof GuildMember) {
      if (!interaction.member.voice.channel)
        return interaction.editReply("Pô cara, tu tá fora do canal de audio.");

      if (client.player && interaction.guild) {
        const queue = client.player.createQueue(interaction.guild);
        if (!queue.connection)
          await queue.connect(interaction.member.voice.channel);
        let embed = new MessageEmbed();

        if (interaction.options.getSubcommand() === "song") {
          let url = interaction.options.getString("url");
          if (url) {
            let result: PlayerSearchResult | null = null;
            if (rYoutube.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
              });
            }
            if (rSpotify.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG,
              });
            }
            if (rSoundcloud.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_TRACK,
              });
            }
            if (rFacebook.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.FACEBOOK,
              });
            }
            if (!result || !result.tracks.length) return noResults;
            const song = result.tracks[0];
            queue.addTrack(song);
            embed
              .setDescription(
                `**[${song.title}](${song.url})** foi adicionado na fila.`
              )
              .setThumbnail(song.thumbnail)
              .setFooter({ text: `Duração: ${song.duration}` });
          }
        }

        if (interaction.options.getSubcommand() === "playlist") {
          let url = interaction.options.getString("url");
          if (url) {
            let result: PlayerSearchResult | null = null;
            if (rYoutube.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
              });
            }
            if (rSpotify.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST,
              });
            }
            if (rSoundcloud.test(url)) {
              result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_PLAYLIST,
              });
            }
            if (!result || !result.tracks.length) return noResults;
            const playlist = result.playlist;
            if (!playlist) return;
            queue.addTracks(result.tracks);
            embed
              .setDescription(
                `**${result.tracks.length}** músicas de **[${playlist.title}](${playlist.url})** foram adicionadas na fila.`
              )
              .setThumbnail(playlist.thumbnail);
          }
        }

        if (interaction.options.getSubcommand() === "search") {
          let searchterms = interaction.options.getString("searchterms");
          if (searchterms) {
            const result = await client.player.search(searchterms, {
              requestedBy: interaction.user,
              searchEngine: QueryType.AUTO,
            });
            if (!result.tracks.length) return noResults;
            const song = result.tracks[0];
            await queue.addTrack(song);
            embed
              .setDescription(
                `**[${song.title}](${song.url})** foi adicionado na fila.`
              )
              .setThumbnail(song.thumbnail)
              .setFooter({ text: `Duração: ${song.duration}` });
          }
        }

        if (interaction.options.getSubcommand() === "auto") {
          if (queue.repeatMode !== QueueRepeatMode.AUTOPLAY) {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            return await interaction.editReply(
              `Deixa que o pai toca! 😎 - **Automático ativado**!`
            );
          } else {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            return await interaction.editReply(`**Automático desativado**!`);
          }
        }

        if (!queue.playing) await queue.play();
        await interaction.editReply({
          embeds: [embed],
        });
      }
    }
  },
};
