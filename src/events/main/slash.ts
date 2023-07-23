import { CommandInteractionOptionResolver } from "discord.js";
import { discordClient } from "../../main";
import { Events } from "../../Event/Event";

export default new Events({
    name: 'interactionCreate',
    run(interaction) {
        if (!interaction.isCommand()) return;
        console.log(interaction);
        const command = discordClient.commands.get(interaction.commandName);
        console.log(command);
        if (!command) return;

        if(interaction.isAutocomplete()) {

        }

        const options: any = interaction.options as CommandInteractionOptionResolver;

        command.run({ client: discordClient, interaction, options })
    }
});