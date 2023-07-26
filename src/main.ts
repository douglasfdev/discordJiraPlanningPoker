import 'dotenv/config';
import { ExtendedClient } from './ExtendedClient';

const discordClient = new ExtendedClient()
discordClient.start();

export { discordClient };