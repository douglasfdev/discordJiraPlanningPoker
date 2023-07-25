import {
    ButtonInteraction,
    Collection,
    ModalSubmitInteraction,
    StringSelectMenuInteraction
} from "discord.js"

export type ComponentsButton = Collection<string, (interaction: ButtonInteraction) => any>
export type ComponentsSelect = Collection<string, (interaction: StringSelectMenuInteraction) => any>
export type ComponentsModal = Collection<string, (interaction: ModalSubmitInteraction) => any>
