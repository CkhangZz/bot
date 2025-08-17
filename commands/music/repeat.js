const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, QueueRepeatMode } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Set repeat mode for the queue')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Repeat mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' }
                )
        ),
    
    async execute(interaction) {
        try {
            // Validate voice channel
            const voiceValidation = validateVoiceChannel(interaction);
            if (!voiceValidation.success) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Error', voiceValidation.message)],
                    ephemeral: true
                });
            }

            const player = useMainPlayer();
            const queue = player.nodes.get(interaction.guild);
            
            // Validate queue
            const queueValidation = validateQueue(queue);
            if (!queueValidation.success) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'No Music Playing', queueValidation.message)],
                    ephemeral: true
                });
            }

            const mode = interaction.options.getString('mode');
            let repeatMode;
            let modeText;
            let emoji;

            switch (mode) {
                case 'off':
                    repeatMode = QueueRepeatMode.OFF;
                    modeText = 'Off';
                    emoji = '▶️';
                    break;
                case 'track':
                    repeatMode = QueueRepeatMode.TRACK;
                    modeText = 'Track';
                    emoji = '🔂';
                    break;
                case 'queue':
                    repeatMode = QueueRepeatMode.QUEUE;
                    modeText = 'Queue';
                    emoji = '🔁';
                    break;
                default:
                    return await interaction.reply({
                        embeds: [createEmbed('error', 'Invalid Mode', 'Invalid repeat mode specified.')],
                        ephemeral: true
                    });
            }

            queue.setRepeatMode(repeatMode);

            await interaction.reply({
                embeds: [createEmbed('success', 'Repeat Mode Changed', 
                    `${emoji} Repeat mode set to **${modeText}**`)]
            });

        } catch (error) {
            console.error('Repeat command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while changing the repeat mode.')],
                ephemeral: true
            });
        }
    }
};
