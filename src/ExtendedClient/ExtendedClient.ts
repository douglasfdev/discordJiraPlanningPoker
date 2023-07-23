import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    Events,
    GatewayIntentBits,
    IntentsBitField,
    Partials
} from "discord.js";
import {
    CommandType,
    ComponentsButton,
    ComponentsModal,
    ComponentsSelect,
    EventType
} from "../types";
import { ascii1, colors, configPlain } from "../config";
import { join } from "path";
import { readdirSync } from "fs";

const fileCondition = (fileName: string) => fileName.endsWith('.ts') || fileName.endsWith('.js');

export class ExtendedClient extends Client {
    public commands: Collection<string, CommandType> = new Collection();
    public buttons: ComponentsButton = new Collection();
    public selects: ComponentsSelect = new Collection();
    public modals: ComponentsModal = new Collection();

    constructor() {
        super({
            intents: new IntentsBitField().add(
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
            ),
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
            ]
        });
    }

    public start() {
        this.registerModules();
        this.registerEvents();
        this.login(configPlain.token);
        console.log(colors.FgGreen, ascii1);
    }

    private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
        this.application?.commands.set(commands)
        .then(() => {
            console.log('✅ Slash commands (/) defined');
        })
        .catch((error: any | unknown) => {
            console.error('❌ an error ocorred while trying to set Slash command ' + error);
        });
    }

    private registerModules() {
        const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

        const commandsPath = join(__dirname, "..", "commands");

        readdirSync(commandsPath).forEach(local => {

            readdirSync(commandsPath + `/${local}/`).filter(fileCondition).forEach(async fileName => {

                const command: CommandType = (await import(`../commands/${local}/${fileName}`))?.default;
                const { name, buttons, selects, modals } = command;

                if (!name) return;

                this.commands.set(name, command);
                slashCommands.push(command);

                if (buttons && selects && modals) {
                    buttons.forEach((run, key) => this.buttons.set(key, run));
                    selects.forEach((run, key) => this.selects.set(key, run));
                    modals.forEach((run, key) => this.modals.set(key, run));
                }
            })
        })

        this.on(Events.ClientReady, () => this.registerCommands(slashCommands));
        this.on(Events.InteractionCreate, () => this.registerCommands(slashCommands));
    }

    private registerEvents() {
        const eventsPath = join(__dirname, "..", "events");

        readdirSync(eventsPath).forEach(local => {

            readdirSync(`${eventsPath}/${local}`).filter(fileCondition)
            .forEach(async fileName => {
                const { name, once, run }: EventType<keyof ClientEvents> = (await import(`../events/${local}/${fileName}`))?.default;

                try {
                    if (name && once) {
                        return this.once(name, run);
                    } else {
                        return this.on(name, run);
                    }
                } catch (er) {
                    console.error(er);
                }
            })
        })
    }
}