import { ClientEvents } from "discord.js";
import { EventType } from "../types";

export class Events<Key extends keyof ClientEvents> {
    constructor(options: EventType<Key>) {
        Object.assign(this, options);
    }
}
