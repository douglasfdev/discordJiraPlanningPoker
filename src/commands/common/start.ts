import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    // UsersClicks, -> para contar a interação
    EmbedBuilder,
} from "discord.js";
import { Command } from "../../Command";
import { jira } from '../../Jira'
import { discordClient } from "../../main";
import { jiraConfig } from "../../config";

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
        const task = options.getString('id', true);
        const vote = options.getString('votacao', true);
        const votes: Array<string> = [];

        if (!vote || !task) {
            interaction.reply({ ephemeral: true, content: 'Vocé precisa especificar uma tarefa' })
        };

        const getTask = await jira.getIssues(task);

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

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [ confirm, cancel ],
        })

        await interaction.reply({
            ephemeral: true,
            components: [ row ],
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

        discordClient.on('interactionCreate', (interaction) => {
            const { user } = interaction;
            if (!interaction.isButton()) return;
            if (interaction.customId === 'confirm') {
                votes.push(interaction.user.username);

                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor("Gold")
                        .setTitle(`${user.username}`)
                        .setThumbnail(`${user.avatarURL()}`)
                        .addFields(
                            { name: 'Voto', value: `${vote}`, inline: true },
                            { name: 'Tarefa', value: `[${task}](https://vadetaxi.atlassian.net/browse/${task})`, inline: true },
                        )
                    ],
                    ephemeral: true,
                })
            } else {
                interaction.reply({ content: 'Voto cancelado', ephemeral: true });
                votes.splice(votes.indexOf(user.username), 1);
                return;
            }
        });
    },
})