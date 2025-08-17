const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateQueue } = require('../../utils/validation');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display information about the currently playing song'),

    async execute(interaction) {
        try {
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

            const track = queue.currentTrack;

            if (!track) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'No Track', 'There is no track currently playing!')],
                    ephemeral: true
                });
            }

            const progress = queue.node.createProgressBar({
                length: 20,
                timecodes: true
            });

            const { createProgressEmbed, createMusicControls } = require('../../utils/embedBuilder');

            const embed = createProgressEmbed(track, queue, {
            transparent: global.transparentMode || false
        });
            const controls = createMusicControls();

            await interaction.reply({ 
                embeds: [embed], 
                components: [controls] 
            });

        } catch (error) {
            console.error('Now playing command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while fetching the current track information.')],
                ephemeral: true
            });
        }
    }
};