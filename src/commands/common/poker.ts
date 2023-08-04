import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../../Command";

export default new Command({
    name: "poker",
    description: "Planning poker",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Planning Poker')
            .setURL('https://vadetaxi.com.br/app-passageiro/')
            .setAuthor({ name: 'Vá de Taxi', iconURL: 'https://i.imgur.com/7eRQDGq.png', url: 'https://vadetaxi.com.br/app-passageiro/' })
            .setDescription('Poker para pontuação de tarefas')
            .setThumbnail('https://i.imgur.com/7eRQDGq.png')
            .addFields(
                { name: '/start', value: 'Inicia o planning poker', inline: true },
            )
            .setImage('https://i.imgur.com/7eRQDGq.png')
            .setTimestamp()
            .setFooter({ text: 'Vá de Taxi', iconURL: 'https://i.imgur.com/7eRQDGq.png' });
        interaction.reply({
            ephemeral: true,
            embeds: [exampleEmbed],
            content: 'Comando /start já inicia o planning poker e após 2 minutos ele faz a contagem dos pontos'
        });
    }
});