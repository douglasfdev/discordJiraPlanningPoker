import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    ComponentType,
    EmbedBuilder,
    GuildMember,
} from "discord.js";
import { Command } from "../../Command";
import { jira } from '../../Jira'
import { configPlain, jiraConfig } from "../../config";

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
                {
                    name: 'votacao',
                    description: 'Digite um valor entre 1 e 21',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        }
    ],
    async run({ interaction, options }) {
        try {
            const task = options.getString('id', true);
            const vote = options.getString('votacao', true);
            const voters: Collection<string, any> = new Collection();
            const votes: Array<{ user: any; vote: string }> = [];
            const { guild } = interaction;
            const roles = configPlain.roleBackend || configPlain.roleMobile;
            const role = guild?.roles.cache.get(roles);
            const totalOfMembers = role?.members.size;
            const getTask = await jira.getIssues(task.trim());

            if (getTask.summary === undefined) {
                interaction.reply({
                    ephemeral: true,
                    content: 'Tarefa não encontrada, tente novamente'
                })
                return;
            }

            const confirm = new ButtonBuilder({
                custom_id: "confirm",
                customId: "confirm",
                label: "Confirmar Voto",
                style: ButtonStyle.Success,
            })

            const cancel = new ButtonBuilder({
                custom_id: "cancel",
                customId: "cancel",
                label: "Cancelar Voto",
                style: ButtonStyle.Danger,
            })

            const finish = new ButtonBuilder({
                custom_id: "finish",
                customId: "finish",
                label: "Finalizar",
                style: ButtonStyle.Primary,
            });

            const finishRow = new ActionRowBuilder<ButtonBuilder>({
                components: [finish],
            });

            const confirmAndCancel = new ActionRowBuilder<ButtonBuilder>({
                components: [confirm, cancel],
            })

            const message = await interaction.reply({
                ephemeral: true,
                components: [confirmAndCancel],
                fetchReply: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor("Gold")
                        .setTitle(`${getTask.summary}`)
                        .setDescription(`[${task}](${jiraConfig.domainURL}/${task})`)
                        .setThumbnail('https://i.imgur.com/7eRQDGq.png')
                        .addFields(
                            { name: 'Voto', value: `${vote}` },
                        )
                ]
            })

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 120000,
            })

            collector.on('collect', async (buttonInteraction) => {
                const { user, customId } = buttonInteraction;

                switch (customId) {
                    case 'confirm':
                        if (!voters.has(user.id)) {
                            votes.push({ user, vote })
                            voters.set(user.id, true);
                        }
                        break;
                    case 'cancel':
                        if (voters.has(user.id)) {
                            votes.splice(votes.findIndex(v => v.user.id === user.id), 1);
                            voters.delete(user.id);
                        }
                        buttonInteraction.reply({
                            ephemeral: true,
                            content: `Voto removido`,
                        })
                        return;
                }

                buttonInteraction.reply({
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
                            components: [finishRow],
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Gold")
                                    .setTitle(`Resultados ${getTask.summary}`)
                                    .addFields(
                                        { name: "Total de Votos", value: `${totalVotes}`, inline: true },
                                        { name: "Quantidade de Votos", value: `${votes.length}`, inline: true },
                                        { name: "Média", value: `${average}`, inline: true }
                                    ),
                            ],
                            content: `O coletor acabou, motivo: ${reason === 'time' ? 'tempo' : reason}'}, tivemos o total de ${collected.size} interações`,
                        })
                    }
                })
            })
        } catch (er: any | unknown) {
            console.error('Erro na chamada da API:', er.message);
        }
    }
})