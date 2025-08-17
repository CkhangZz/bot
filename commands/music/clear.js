const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the music queue'),
    
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

            if (queue.tracks.data.length === 0) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'Queue Empty', 'The queue is already empty!')],
                    ephemeral: true
                });
            }

            const trackCount = queue.tracks.data.length;
            queue.tracks.clear();

            await interaction.reply({
                embeds: [createEmbed('success', 'Queue Cleared', 
                    `🗑️ Cleared **${trackCount}** song${trackCount !== 1 ? 's' : ''} from the queue!`)]
            });

        } catch (error) {
            console.error('Clear command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while clearing the queue.')],
                ephemeral: true
            });
        }
    }
};
