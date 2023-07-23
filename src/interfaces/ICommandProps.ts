import {
    CommandInteraction,
    CommandInteractionOption,
} from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

export interface ICommandProps {
    client: ExtendedClient;
    interaction: CommandInteraction;
    options: CommandInteractionOption;
}