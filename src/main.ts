import 'dotenv/config';
import { ExtendedClient } from './ExtendedClient';
import { Events } from 'discord.js';

const discordClient = new ExtendedClient()
discordClient.start();

export { discordClient };