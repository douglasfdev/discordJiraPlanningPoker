import { Events } from "discord.js";
import { Event } from "../../Event"
import { discordClient } from "../../main"

export default new Event({
    name: Events.InteractionCreate,
    run(interaction) {
        if (interaction.isModalSubmit()) discordClient.modals.get(interaction.customId)?.(interaction);
        if (interaction.isButton()) discordClient.buttons.get(interaction.customId)?.(interaction);
        if (interaction.isStringSelectMenu()) discordClient.selects.get(interaction.customId)?.(interaction);
    }
})
