import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CacheType,
    Collection,
} from "discord.js";
import { Command } from "../../Command";

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
        const tarefa = options.getString('id', true);
        const voto = options.getString('votacao', true);

        if (!tarefa || !voto) {
            interaction.reply({ ephemeral: true, content: 'Vocé precisa especificar uma tarefa' })
        };

        const confirm = new ButtonBuilder({
            custom_id: "confirm",
            customId: "confirm",
            label: "confirmar voto",
            style: ButtonStyle.Success,
        })

		const cancel = new ButtonBuilder({
            custom_id: "cancel",
            customId: "cancel",
            label: "cancelar voto",
            style: ButtonStyle.Danger,
        })

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [ confirm, cancel ],
        })

        await interaction.reply({
            ephemeral: true,
            content: `Seu voto vai ser na tarefa de id: ${tarefa}. E seu voto foi ${voto}`,
            components: [ row ],
        })
    },
    buttons: new Collection([
        [ 'confirm', async (interaction: ButtonInteraction<CacheType>) => {
            await interaction.deferReply()
            await interaction.editReply({ content: 'Voto confirmado' })
            await interaction.channel?.send('Voto confirmado')
        }],
        [ 'cancel', async (interaction: ButtonInteraction<CacheType>) => {
            await interaction.deferReply()
            await interaction.editReply({ content: 'Voto cancelado' })
            await interaction.channel?.send('Voto cancelado')
        }],
    ])
})