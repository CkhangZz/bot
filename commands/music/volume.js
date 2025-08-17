const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateVoiceChannel, validateQueue } = require('../../utils/validation');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the music volume')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)
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

            const volume = interaction.options.getInteger('level');
            const previousVolume = queue.node.volume;

            queue.node.setVolume(volume);

            let volumeEmoji;
            if (volume === 0) volumeEmoji = '🔇';
            else if (volume < 30) volumeEmoji = '🔈';
            else if (volume < 70) volumeEmoji = '🔉';
            else volumeEmoji = '🔊';

            await interaction.reply({
                embeds: [createEmbed('success', 'Volume Changed', 
                    `${volumeEmoji} Volume changed from **${previousVolume}%** to **${volume}%**`)]
            });

        } catch (error) {
            console.error('Volume command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while changing the volume.')],
                ephemeral: true
            });
        }
    }
};
