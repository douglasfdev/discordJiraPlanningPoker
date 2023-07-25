import 'dotenv/config';
import { ExtendedClient } from './ExtendedClient';
import { jiraConfig } from './config';

const discordClient = new ExtendedClient()
discordClient.start();

export { discordClient };