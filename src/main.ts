import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { Bot } from './bot/bot';
import { PlanningPokerService } from './services/PlanningPoker';
import { JiraService } from './services/JiraService';

const config = process.env.TOKEN;
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

const jiraService = new JiraService();
const planningPokerService = new PlanningPokerService(jiraService);
const bot = new Bot(discordClient, config.prefix, planningPokerService);

discordClient.once('ready', () => {
  console.log('Bot is ready!');
});

discordClient.on('message', (message) => {
  bot.handleMessage(message);
});

discordClient.login(config);