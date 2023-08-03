import { ApplicationCommandData, AutocompleteInteraction, Message } from "discord.js";
import { ICommandComponents, ICommandProps } from "../interfaces";

export type CommandType = ApplicationCommandData & ICommandComponents & {
    run(props: ICommandProps): any
    autoComplete?: (interaction: AutocompleteInteraction) => any;
}