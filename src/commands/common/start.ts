import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    ComponentType,
    // UsersClicks, -> para contar a interação
    EmbedBuilder,
    Events,
} from "discord.js";
import { Command } from "../../Command";
import { jira } from '../../Jira'
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
        const voters: Array<any> = [];
        const votes: Array<string> = [];
        const { channel } = interaction;

        if (!vote || !task) {
            interaction.reply({ ephemeral: true, content: 'Vocé precisa especificar uma tarefa e um voto' })
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

        const confirmAndCancel = new ActionRowBuilder<ButtonBuilder>({
            components: [ confirm, cancel ],
        })

        const message = await interaction.reply({
            ephemeral: true,
            components: [ confirmAndCancel ],
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
        })

        collector.on('collect', async (buttonInteraction) => {
            const { user } = buttonInteraction;

            votes.push(vote);

            if (voters.includes(user.id)) {
                return;
            }

            voters.push(user);

            buttonInteraction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Gold")
                        .setTitle(`${user.username}`)
                        .setDescription(`(${user})`)
                        .setThumbnail(`${user.displayAvatarURL()}`)
                        .addFields(
                            { name: 'Voto', value: `${vote}`, inline: true },
                            { name: 'Tarefa', value: `[${task}](https://vadetaxi.atlassian.net/browse/${task})
                            ${getTask.summary}`, inline: true },
                        )
                ],
                ephemeral: true,
            })
        })
    },
})