const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),
    
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

            if (queue.node.isPaused()) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'Already Paused', 'The music is already paused!')],
                    ephemeral: true
                });
            }

            queue.node.pause();

            await interaction.reply({
                embeds: [createEmbed('success', 'Music Paused', '⏸️ Music has been paused!')]
            });

        } catch (error) {
            console.error('Pause command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while pausing the music.')],
                ephemeral: true
            });
        }
    }
};
