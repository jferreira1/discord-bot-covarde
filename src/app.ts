import "dotenv/config";
import {
  Client,
  Collection,
  CommandInteraction,
  Interaction,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import { Player } from "discord-player";
import { ClientInterface } from "./utils/interfaces/Client.interface";

const TOKEN = process.env.TOKEN ?? "";
const APP_ID = process.env.APP_ID ?? "";
const GUILD_ID = process.env.GUILD_ID ?? "";
const LOAD_SLASH = process.argv[2] === "load";

const client: ClientInterface = new Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES"],
});

client.slashCommands = new Collection();
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

interface Commands {
  name: String;
  description: String;
  options: Object[];
  default_permission: undefined;
}

let commands: Commands[] = [];

const slashFiles = fs
  .readdirSync(`${__dirname}/slash`)
  .filter((file) => file.endsWith(".ts"));
for (const file of slashFiles) {
  let slashCommand = require(`${__dirname}/slash/${file}`);
  client.slashCommands?.set(slashCommand.default.data.name, slashCommand);
  if (LOAD_SLASH) commands.push(slashCommand.default.data.toJSON());
}

if (LOAD_SLASH) {
  const rest = new REST({ version: "9" }).setToken(TOKEN);
  console.log("Deploying slash commands. 👷🏻‍♂️");
  rest
    .put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
      body: commands,
    })
    .then(() => {
      console.log("Slash commands loaded successfully. ✅");
      process.exit(0);
    })
    .catch((err) => {
      if (err) {
        process.exit(1);
      }
    });
} else {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}! 👌🏻`);
    console.log(`Server: ${GUILD_ID}`);
  });
  client.on("interactionCreate", (interaction: Interaction) => {
    async function handleCommand() {
      if (interaction instanceof CommandInteraction) {
        const slashCommand: any = client.slashCommands?.get(
          interaction.commandName
        );
        if (!slashCommand) interaction.reply("Comando inválido ❌");
        await interaction.deferReply();
        await slashCommand.default.run(client, interaction);
      }
    }
    handleCommand();
  });
  client.login(TOKEN);
}
