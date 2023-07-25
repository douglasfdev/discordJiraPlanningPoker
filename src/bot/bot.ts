import {
  Client,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
// import { PlanningPokerService } from '../services/PlanningPoker';

export class Bot {
  private discordClient: Client;
  private prefix: string;
  // private planningPokerService: PlanningPokerService;
  private votingActive: boolean;
  private votes: { [userId: string]: number };

  constructor(
        discordClient: Client,
        prefix: string,
       // planningPokerService: PlanningPokerService
    ) {
    this.discordClient = discordClient;
    this.prefix = prefix;
    // this.planningPokerService = planningPokerService;
    this.votingActive = false;
    this.votes = {};

  }

  public handleMessage(message: Message): void {
    if (message.author.bot) return;

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    switch (command) {
      case 'start':
        this.startVoting(message);
        break;
      case 'vote':
        this.handleVote(message, args);
        break;
      case 'end':
        this.endVoting(message);
        break;
      default:
        message.channel.send('Comando inválido. Use "!start", "!vote" ou "!end".');
        break;
    }
  }

  public generateFibonacciSequence(): number[] {
    const sequence: number[] = [0, 1];
    while (sequence[sequence.length - 1] + sequence[sequence.length - 2] <= 89) {
      const nextFibonacciNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      sequence.push(nextFibonacciNumber);
    }
    return sequence;
  }

  private startVoting(message: Message): void {
    if (this.votingActive) {
      message.channel.send('Já existe uma votação em andamento.');
      return;
    }

    this.votingActive = true;
    this.votes = {};
    const fibonacciSequence = this.generateFibonacciSequence();

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        fibonacciSequence.map((value) =>
          new ButtonBuilder()
            .setCustomId(value.toString())
            .setLabel(value.toString())
            .setStyle(ButtonStyle.Primary)
        )
      );

    message.channel.send({
      content: 'Escolha o valor desejado:',
      components: [row],
    });
  }

  private handleVote(message: Message, args: string[]): void {
    if (!this.votingActive) {
      message.channel.send('Não há votação em andamento.');
      return;
    }

    const vote = parseInt(args[0]);
    if (isNaN(vote)) {
      message.channel.send('Escolha inválida. Use um número válido da sequência de Fibonacci.');
      return;
    }

    const userId = message.author.id;
    this.votes[userId] = vote;
    message.channel.send(`Voto registrado: ${vote}`);
  }

  private endVoting(message: Message): void {
    if (!this.votingActive) {
      message.channel.send('Não há votação em andamento.');
      return;
    }

    this.votingActive = false;
    const voterIds = Object.keys(this.votes);
    if (voterIds.length === 0) {
      message.channel.send('Nenhum voto registrado.');
      return;
    }

    const totalVotes = voterIds.reduce((total, userId) => total + this.votes[userId], 0);
    const averageVote = totalVotes / voterIds.length;
    message.channel.send(`Votação encerrada. Média dos votos: ${averageVote}`);
  }

}
