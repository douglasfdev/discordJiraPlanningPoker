import { ApplicationCommandData } from "discord.js";
import { ICommandComponents, ICommandProps } from "../interfaces";

export type CommandType = ApplicationCommandData & ICommandComponents & {
    run(props: ICommandProps): any
}