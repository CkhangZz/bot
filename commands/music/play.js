const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const { createEmbed, createMusicEmbed, createMusicControls } = require('../../utils/embedBuilder');
const { validateVoiceChannel } = require('../../utils/validation');
const { retryVoiceConnection } = require('../../utils/audioHelper');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const query = interaction.options.getString('query');

            // Validate voice channel
            const validation = validateVoiceChannel(interaction);
            if (!validation.success) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Error', validation.message)],
                    ephemeral: true
                });
            }

            await interaction.deferReply();

            const player = useMainPlayer();

            try {
                const searchResult = await player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                });

                if (!searchResult || !searchResult.tracks.length) {
                    return await interaction.editReply({
                        embeds: [createEmbed('error', 'No Results', `No results found for **${query}**`)]
                    });
                }

                // Use retry logic for voice connection
                const { track } = await retryVoiceConnection(async () => {
                    return await player.play(interaction.member.voice.channel, searchResult, {
                        nodeOptions: {
                            metadata: {
                                channel: interaction.channel,
                                requestedBy: interaction.user
                            },
                            volume: 80,
                            leaveOnEmpty: true,
                            leaveOnEmptyCooldown: 300000,
                            leaveOnEnd: true,
                            leaveOnEndCooldown: 300000,
                            selfDeaf: true,
                            bufferingTimeout: 15000,
                            connectionTimeout: 45000,
                            maxSize: 50,
                            maxHistorySize: 50,
                            spotifyBridge: false,
                            disableVolume: false,
                            noEmitAddTrackOnPlay: false
                        }
                    });
                }, 3);

                const { createMusicEmbed, createMusicControls } = require('../../utils/embedBuilder');

                const embed = createMusicEmbed(track, 'Now Playing', interaction.user, {
                    useGradient: true,
                    transparent: global.transparentMode || false
                });

                const controls = createMusicControls();

                await interaction.editReply({ 
                    embeds: [embed],
                    components: [controls]
                });

            } catch (error) {
                console.error('Play command error:', error);
                await interaction.editReply({
                    embeds: [createEmbed('error', 'Playback Error', 
                        'There was an error trying to play that track. Please try again.')]
                });
            }

        } catch (error) {
            console.error('Play command error:', error);

            if (interaction.deferred) {
                await interaction.editReply({
                    embeds: [createEmbed('error', 'Error', 'An unexpected error occurred.')]
                });
            } else {
                await interaction.reply({
                    embeds: [createEmbed('error', 'Error', 'An unexpected error occurred.')],
                    ephemeral: true
                });
            }
        }
    }
};