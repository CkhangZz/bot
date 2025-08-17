const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),
    
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

            if (!queue.node.isPaused()) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'Not Paused', 'The music is not paused!')],
                    ephemeral: true
                });
            }

            queue.node.resume();

            await interaction.reply({
                embeds: [createEmbed('success', 'Music Resumed', '▶️ Music has been resumed!')]
            });

        } catch (error) {
            console.error('Resume command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while resuming the music.')],
                ephemeral: true
            });
        }
    }
};
