export const configPlain = {
    prefix: '!',
    token: process.env.DISCORD_TOKEN,
    applicationId: process.env.APPLICATION_ID,
    applicationKey: process.env.PUBLIC_KEY,
    guildId: process.env.GUILD_ID,
}

export const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
}

export const ascii1 = `
/$$$$$$$  /$$                               /$$                           /$$$$$$$           /$$                                 /$$$$$$$              /$$
| $$__  $$| $$                              |__/                          | $$__  $$         | $$                                | $$__  $$            | $$
| $$  \\ $$| $$  /$$$$$$  /$$$$$$$  /$$$$$$$  /$$ /$$$$$$$   /$$$$$$       | $$  \\ $$ /$$$$$$ | $$   /$$  /$$$$$$   /$$$$$$       | $$  \\ $$  /$$$$$$  /$$$$$$
| $$$$$$$/| $$ |____  $$| $$__  $$| $$__  $$| $$| $$__  $$ /$$__  $$      | $$$$$$$//$$__  $$| $$  /$$/ /$$__  $$ /$$__  $$      | $$$$$$$  /$$__  $$|_  $$_/
| $$____/ | $$  /$$$$$$$| $$  \\ $$| $$  \\ $$| $$| $$  \\ $$| $$  \\ $$      | $$____/| $$  \\ $$| $$$$$$/ | $$$$$$$$| $$  \\__/      | $$__  $$| $$  \\ $$  | $$
| $$      | $$ /$$__  $$| $$  | $$| $$  | $$| $$| $$  | $$| $$  | $$      | $$     | $$  | $$| $$_  $$ | $$_____/| $$            | $$  \\ $$| $$  | $$  | $$ /$$
| $$      | $$|  $$$$$$$| $$  | $$| $$  | $$| $$| $$  | $$|  $$$$$$$      | $$     |  $$$$$$/| $$ \\  $$|  $$$$$$$| $$            | $$$$$$$/|  $$$$$$/  |  $$$$/
|__/      |__/ \\_______/|__/  |__/|__/  |__/|__/|__/  |__/ \\____  $$      |__/      \\______/ |__/  \\__/ \\_______/|__/            |_______/  \\______/    \\___/
                                                           /$$  \\ $$
                                                          |  $$$$$$/
                                                           \\______/
`;

const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

export const fibonacciSequence = (limit: number): Array<number> => {
    const sequence: Array<number> = [];
    for (let i = 0; i <= limit; i++) {
      sequence.push(fibonacci(i));
    }
    return sequence;
  };
