import { CommandInteractionOptionResolver, Events } from "discord.js";
import { discordClient } from "../../main";
import { Event } from "../../Event";

export default new Event({
    name: Events.InteractionCreate,
    run(interaction) {
        if (!interaction.isCommand()) return;
        const command = discordClient.commands.get(interaction.commandName);
        if (!command) return;

        const options: any = interaction.options as CommandInteractionOptionResolver;

        command.run({ client: discordClient, interaction, options })
    }
});