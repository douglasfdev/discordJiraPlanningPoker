import { ApplicationCommandType } from "discord.js";
import { Command } from "../../Command/Command";

export default new Command({
    name: "ping",
    description: "Ping command",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {
        interaction.reply({ ephemeral: true, content: 'pong'})
    }
})