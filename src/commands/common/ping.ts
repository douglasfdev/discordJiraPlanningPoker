import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Collection
} from "discord.js";
import { Command } from "../../Command";

export default new Command({
    name: "ping",
    description: "reply with pong",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {
        const confirm = new ButtonBuilder()
            .setCustomId('confirm-button')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel-button')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);


        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(confirm, cancel);

        interaction.reply({ ephemeral: true, content: 'pong', components: [ row ]});
    },
    buttons: new Collection([
        ["confirm-button", async (interaction) => interaction.update({ components: [] })],
    ]),
})