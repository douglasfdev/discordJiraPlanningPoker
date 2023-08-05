import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    ComponentType,
    EmbedBuilder,
    SelectMenuComponentOptionData,
    StringSelectMenuBuilder,
} from "discord.js";
import { Command } from "../../Command";
import { jira } from '../../Jira'
import { configPlain, jiraConfig } from "../../config";
import { VotesType } from "../../types";

export default new Command({
    name: "start",
    description: "starts a planning",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'tarefa',
            description: 'Digite um uma tarefa pelo ID',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'Digite um id de tarefa',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        }
    ],
    async run({ interaction, options }) {
        try {
            const task = options.getString('id', true);
            const voters: Collection<string, any> = new Collection();
            const votes: Array<VotesType> = [];
            const { guild } = interaction;
            const roles = configPlain.roleBackend || configPlain.roleMobile;
            const role = guild?.roles.cache.get(roles);
            const totalOfMembers = role?.members.size;
            const getTask = await jira.getIssues(task.trim());
            const fibonacciOptions: SelectMenuComponentOptionData[] = [];

            for (let i = 1; i <= 21; i++) {
                if (isFibonacci(i)) {
                    fibonacciOptions.push({
                        label: i.toString(),
                        value: i.toString(),
                    });
                }
            }

            if (getTask.summary === undefined) {
                interaction.reply({
                    ephemeral: true,
                    content: 'Tarefa não encontrada, tente novamente'
                })
                return;
            }

            const selectVoteMenu = new ActionRowBuilder<StringSelectMenuBuilder>({components: [
                new StringSelectMenuBuilder({
                    customId: "vote_selection",
                    placeholder: "Selecione um valor de votação",
                    options: fibonacciOptions,
                    minValues: 1,
                    maxValues: 1,
                })
            ]});

            const message = await interaction.reply({
                components: [selectVoteMenu],
                fetchReply: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor("Gold")
                        .setTitle(`${getTask.summary}`)
                        .setDescription(`[${task}](${jiraConfig.domainURL}/${task})`)
                        .setThumbnail('https://i.imgur.com/7eRQDGq.png')
                ]
            })

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 15000,
            })

            collector.on('collect', async (selectInteraction) => {
                const { user, values } = selectInteraction;

                const vote = values[0];
                if (!voters.has(user.id)) {
                    votes.push({user, vote});
                    voters.set(user.id, true);
                } else {
                    if (voters.has(user.id)) {
                        votes.splice(votes.findIndex(v => v.user.id === user.id), 1);
                        voters.delete(user.id);
                    }
                }

                selectInteraction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Gold")
                            .setTitle(`${user.username}`)
                            .setDescription(`(${user})`)
                            .setThumbnail(`${user.displayAvatarURL()}`)
                            .addFields(
                                { name: 'Voto', value: `${vote}`, inline: true },
                                {
                                    name: 'Tarefa', value: `[${task}](https://${jiraConfig.domain}.atlassian.net/browse/${task})
                                ${getTask.summary}`, inline: true
                                },
                            )
                    ],
                    ephemeral: true,
                });
                collector.on('end', async (collected, reason) => {
                    if (votes.length === totalOfMembers) {
                        const totalVotes = votes
                            .reduce((total, data) => total + parseInt(data.vote), 0);
                        const average = votes.length > 0 ? totalVotes / votes.length : 'N/A';

                        interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Gold")
                                    .setTitle(`Resultados de: ${getTask.summary} | Prioridade:`)
                                    .addFields(
                                        { name: "Total de Votos", value: `${totalVotes}`, inline: true },
                                        { name: "Quantidade de Votos", value: `${votes.length}`, inline: true },
                                        { name: "Média", value: `${average}`, inline: true },
                                    ),
                            ],
                            content: `O coletor acabou, motivo: ${reason === 'time' ? 'tempo' : reason}, tivemos o total de ${collected.size} interações`,
                        })
                    }
                })
            })
        } catch (er: any | unknown) {
            console.error('Erro na chamada da API:', er.message);
        }
    }
})

function isFibonacci(num: number): boolean {
    const fibNumbers = [1, 1];
    while (fibNumbers[fibNumbers.length - 1] < num) {
        fibNumbers.push(fibNumbers[fibNumbers.length - 1] + fibNumbers[fibNumbers.length - 2]);
    }
    return fibNumbers.includes(num);
}