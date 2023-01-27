"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const fs_1 = __importDefault(require("fs"));
const discord_player_1 = require("discord-player");
const TOKEN = (_a = process.env.TOKEN) !== null && _a !== void 0 ? _a : "";
const APP_ID = (_b = process.env.APP_ID) !== null && _b !== void 0 ? _b : "";
const GUILD_ID = (_c = process.env.GUILD_ID) !== null && _c !== void 0 ? _c : "";
const LOAD_SLASH = process.argv[2] === "load";
const client = new discord_js_1.Client({
    intents: ["Guilds", "GuildVoiceStates"],
});
client.slashCommands = new discord_js_1.Collection();
client.player = new discord_player_1.Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});
let commands = [];
const slashFiles = fs_1.default
    .readdirSync(`${__dirname}/slash`)
    .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
    let slashCommand = require(`${__dirname}/slash/${file}`);
    (_d = client.slashCommands) === null || _d === void 0 ? void 0 : _d.set(slashCommand.default.data.name, slashCommand);
    if (LOAD_SLASH)
        commands.push(slashCommand.default.data.toJSON());
}
if (LOAD_SLASH) {
    const rest = new rest_1.REST({ version: "9" }).setToken(TOKEN);
    console.log("Deploying slash commands. 👷🏻‍♂️");
    rest
        .put(v9_1.Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
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
}
else {
    client.on("ready", () => {
        var _a;
        console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}! 👌🏻`);
        console.log(`Server: ${GUILD_ID}`);
    });
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            var _a;
            if (interaction instanceof discord_js_1.ChatInputCommandInteraction) {
                const slashCommand = (_a = client.slashCommands) === null || _a === void 0 ? void 0 : _a.get(interaction.commandName);
                if (!slashCommand)
                    interaction.reply("Comando inválido ❌");
                await interaction.deferReply();
                await slashCommand.default.run(client, interaction);
            }
        }
        handleCommand();
    });
    client.login(TOKEN);
}
