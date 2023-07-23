import { ApplicationCommandData, Message } from "discord.js";
import { ICommandComponents, ICommandProps } from "../interfaces";
import { GamesType } from "./";

export type CommandType = ApplicationCommandData & ICommandComponents & {
    run(props: ICommandProps): any
    execute?(message: Message, args: GamesType): Promise<void>;
}