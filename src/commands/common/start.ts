import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    GuildChannel
} from "discord.js";
import { Command } from "../../Command";
import { Poker } from "../../Poker";
import { run } from "node:test";

export default new Command({
    name: "start",
    description: "starts a planning",
    type: ApplicationCommandType.ChatInput,
    async execute(message, { games }): Promise<void> {

        const channel = message.channel as GuildChannel;

        if (channel) {
            console.log(`Planning poker is being started in channel: ${channel.name}`);
        }

        if (games.has(channel.id)) {
            message.channel.send("Game is already in progress in this channel!");
            return;
        }

        games.set(channel.id, new Poker());

        await message.channel.send(
            [
              "Welcome to planning poker.\n",
              "Start the first round with:",
              "> !play <question>\n",
              "You'll have 30 seconds to send me a DM containing a single integer representing your estimated story points",
              "(an easy way to DM me is to click my name above my messages).\n",
              "Stop playing at any time with:",
              "> !end",
              "If you want to play along, react to this message.",
            ].join("\n")
        );

        message.channel.lastMessage?.react("👍");
    },
    run({ interaction }) {
        return;
    }
})