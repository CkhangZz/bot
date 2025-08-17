const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    
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

            const currentTrack = queue.currentTrack;
            
            if (!queue.tracks.data.length && !currentTrack) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'Queue Empty', 'There are no more songs in the queue to skip to!')],
                    ephemeral: true
                });
            }

            queue.node.skip();

            await interaction.reply({
                embeds: [createEmbed('success', 'Song Skipped', 
                    `⏭️ Skipped **${currentTrack.title}**${queue.tracks.data.length > 0 ? '\nNow playing the next song!' : '\nQueue is now empty.'}`)]
            });

        } catch (error) {
            console.error('Skip command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while skipping the song.')],
                ephemeral: true
            });
        }
    }
};
