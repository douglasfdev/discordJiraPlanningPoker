import { ApplicationCommandData, AutocompleteInteraction, Message } from "discord.js";
import { ICommandComponents, ICommandProps } from "../interfaces";

export type CommandType = ApplicationCommandData & ICommandComponents & {
    run(props: ICommandProps): void
    autoComplete?: (interaction: AutocompleteInteraction) => any;
}