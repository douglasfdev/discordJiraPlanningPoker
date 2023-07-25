import { ApplicationCommandData, AutocompleteInteraction, Message } from "discord.js";
import { ICommandComponents, ICommandProps } from "../interfaces";
import { GamesType } from "./";

export type CommandType = ApplicationCommandData & ICommandComponents & {
    run(props: ICommandProps): any
    autoComplete?: (interaction: AutocompleteInteraction) => any;
    execute?: (message: Message, args: GamesType) => Promise<void>;
}