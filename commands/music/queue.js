const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');
const { validateQueue } = require('../../utils/validation');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number to display')
                .setMinValue(1)
        ),
    
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

            const currentTrack = queue.currentTrack;
            const tracks = queue.tracks.data;
            
            if (!currentTrack && tracks.length === 0) {
                return await interaction.reply({
                    embeds: [createEmbed('info', 'Empty Queue', 'There are no songs in the queue!')],
                    ephemeral: true
                });
            }

            const tracksPerPage = 10;
            const page = interaction.options.getInteger('page') || 1;
            const totalPages = Math.ceil(tracks.length / tracksPerPage);
            
            if (page > totalPages && totalPages > 0) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Invalid Page', `Page ${page} doesn't exist! There are only ${totalPages} page(s).`)],
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`${config.emojis.queue} Music Queue`)
                .setFooter({ 
                    text: `Page ${page}/${Math.max(totalPages, 1)} • ${tracks.length} song(s) in queue`,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            // Current track
            if (currentTrack) {
                const progress = queue.node.createProgressBar();
                embed.addFields({
                    name: '🎵 Now Playing',
                    value: `**[${currentTrack.title}](${currentTrack.url})**\n` +
                           `Duration: \`${currentTrack.duration}\` • Requested by: ${currentTrack.requestedBy}\n` +
                           `${progress}`,
                    inline: false
                });
            }

            // Queue tracks
            if (tracks.length > 0) {
                const startIndex = (page - 1) * tracksPerPage;
                const endIndex = Math.min(startIndex + tracksPerPage, tracks.length);
                const pageTracks = tracks.slice(startIndex, endIndex);

                const queueList = pageTracks.map((track, index) => {
                    const position = startIndex + index + 1;
                    return `\`${position}.\` **[${track.title}](${track.url})**\n` +
                           `Duration: \`${track.duration}\` • Requested by: ${track.requestedBy}`;
                }).join('\n\n');

                embed.addFields({
                    name: `📄 Up Next (${tracks.length} song${tracks.length !== 1 ? 's' : ''})`,
                    value: queueList,
                    inline: false
                });
            }

            // Queue stats
            const totalDuration = tracks.reduce((total, track) => {
                const duration = track.durationMS || 0;
                return total + duration;
            }, 0);

            const hours = Math.floor(totalDuration / 3600000);
            const minutes = Math.floor((totalDuration % 3600000) / 60000);
            const totalDurationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            if (tracks.length > 0) {
                embed.addFields({
                    name: '📊 Queue Statistics',
                    value: `Total Duration: \`${totalDurationStr}\`\n` +
                           `Repeat Mode: \`${queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Track' : 'Queue'}\`\n` +
                           `Volume: \`${queue.node.volume}%\``,
                    inline: true
                });
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Queue command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while displaying the queue.')],
                ephemeral: true
            });
        }
    }
};
