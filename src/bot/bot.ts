import { Client, Message } from 'discord.js';
import { PlanningPokerService } from '../services/PlanningPoker';

export class Bot {
  private discordClient: Client;
  private prefix: string;
  private planningPokerService: PlanningPokerService;

  constructor(
        discordClient: Client,
        prefix: string,
        planningPokerService: PlanningPokerService
    ) {
    this.discordClient = discordClient;
    this.prefix = prefix;
    this.planningPokerService = planningPokerService;
  }

  handleMessage(message: Message): void {
    if (!message.content.startsWith(this.prefix) || message.author.bot) return;

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case 'start':
        // Implemente a lógica para iniciar o planning poker com o comando "!start"
        break;
      case 'vote':
        // Implemente a lógica para registrar o voto com o comando "!vote"
        break;
      case 'end':
        // Implemente a lógica para encerrar o planning poker com o comando "!end"
        break;
      default:
        message.channel.send('Comando inválido. Use "!start", "!vote" ou "!end".');
        break;
    }
  }
}
