import { CommandType } from "../types";

export class Command {
    constructor(options: CommandType) {
        options.dmPermission = false;
        Object.assign(this, options);
    }
}