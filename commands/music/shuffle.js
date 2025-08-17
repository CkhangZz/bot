const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the music queue'),
    
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

            if (queue.tracks.data.length < 2) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'Insufficient Songs', 'Need at least 2 songs in the queue to shuffle!')],
                    ephemeral: true
                });
            }

            queue.tracks.shuffle();

            await interaction.reply({
                embeds: [createEmbed('success', 'Queue Shuffled', 
                    `🔀 Successfully shuffled **${queue.tracks.data.length}** songs in the queue!`)]
            });

        } catch (error) {
            console.error('Shuffle command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while shuffling the queue.')],
                ephemeral: true
            });
        }
    }
};
