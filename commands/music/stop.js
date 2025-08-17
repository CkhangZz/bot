const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue'),
    
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

            queue.delete();

            await interaction.reply({
                embeds: [createEmbed('success', 'Music Stopped', '⏹️ Music has been stopped and queue cleared!')]
            });

        } catch (error) {
            console.error('Stop command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while stopping the music.')],
                ephemeral: true
            });
        }
    }
};
