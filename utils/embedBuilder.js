const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

/**
 * Create a standardized embed with consistent styling and transparency effects
 * @param {string} type - The type of embed (success, error, warning, info, primary)
 * @param {string} title - The title of the embed
 * @param {string} description - The description of the embed
 * @param {object} options - Additional options for the embed
 * @returns {EmbedBuilder} The configured embed
 */
function createEmbed(type, title, description, options = {}) {
    const embed = new EmbedBuilder()
        .setTimestamp();

    // Enhanced title with transparency effects
    const transparentTitle = options.transparent ? 
        `✦ ${title} ✦` : title;
    embed.setTitle(transparentTitle);

    // Enhanced description with subtle transparency styling
    const transparentDescription = options.transparent ? 
        `╭─ ${description} ─╮` : description;
    embed.setDescription(transparentDescription);

    // Set color based on type with transparency-friendly colors
    switch (type) {
        case 'success':
            embed.setColor(options.transparent ? config.colors.transparentSuccess : config.colors.success);
            break;
        case 'error':
            embed.setColor(options.transparent ? config.colors.transparentError : config.colors.error);
            break;
        case 'warning':
            embed.setColor(options.transparent ? config.colors.transparentWarning : config.colors.warning);
            break;
        case 'info':
            embed.setColor(options.transparent ? config.colors.transparentInfo : config.colors.info);
            break;
        case 'primary':
        default:
            embed.setColor(options.transparent ? config.colors.transparentPrimary : config.colors.primary);
            break;
    }

    // Add additional options
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.footer) {
        const transparentFooter = options.transparent ? {
            ...options.footer,
            text: `○ ${options.footer.text} ○`
        } : options.footer;
        embed.setFooter(transparentFooter);
    }
    if (options.fields) {
        const transparentFields = options.transparent ? 
            options.fields.map(field => ({
                ...field,
                name: `◈ ${field.name}`,
                value: `\`\`\`yaml\n${field.value}\n\`\`\``
            })) : options.fields;
        embed.addFields(transparentFields);
    }
    if (options.author) embed.setAuthor(options.author);

    return embed;
}

/**
 * Create an enhanced music embed with track information and transparency
 * @param {object} track - The track object
 * @param {string} action - The action being performed (playing, added, etc.)
 * @param {object} user - The user who requested the track
 * @param {object} options - Additional styling options
 * @returns {EmbedBuilder} The configured music embed
 */
function createMusicEmbed(track, action, user, options = {}) {
    const actionEmojis = {
        'Now Playing': config.emojis.playing,
        'Added to Queue': config.emojis.queue,
        'Playing': config.emojis.playing,
        'Paused': config.emojis.paused,
        'Resumed': config.emojis.playing,
        'Skipped': config.emojis.skip
    };

    const emoji = actionEmojis[action] || config.emojis.music;

    // Transparent styling
    const transparentTitle = options.transparent ? 
        `✧･ﾟ: *✧･ﾟ:* ${emoji} ${action} *:･ﾟ✧*:･ﾟ✧` : 
        `${emoji} ${action}`;

    const transparentDescription = options.transparent ? 
        `╭─────── ✦ ─────── ✦ ───────╮\n${config.emojis.note} **[${track.title}](${track.url})**\n╰─────── ✦ ─────── ✦ ───────╯` :
        `${config.emojis.note} **[${track.title}](${track.url})**`;

    const embed = new EmbedBuilder()
        .setColor(options.transparent ? config.colors.transparentPrimary : 
                 (options.useGradient ? config.gradients.music[0] : config.colors.primary))
        .setTitle(transparentTitle)
        .setDescription(transparentDescription)
        .setThumbnail(track.thumbnail)
        .setTimestamp();

    // Enhanced fields with better icons and formatting
    const fields = [
        {
            name: `${config.emojis.microphone} Artist`,
            value: `\`${track.author}\``,
            inline: true
        },
        {
            name: `${config.emojis.headphones} Duration`,
            value: `\`${track.duration}\``,
            inline: true
        },
        {
            name: `${config.emojis.crown} Requested by`,
            value: user.toString(),
            inline: true
        }
    ];

    // Add optional fields
    if (track.views) {
        fields.push({
            name: `${config.emojis.fire} Views`,
            value: `\`${formatNumber(track.views)}\``,
            inline: true
        });
    }

    if (track.source) {
        fields.push({
            name: `${config.emojis.radio} Source`,
            value: `\`${track.source}\``,
            inline: true
        });
    }

    embed.addFields(fields);

    // Add beautiful footer
    embed.setFooter({ 
        text: `${config.emojis.sparkles} Enjoying the music? ${config.emojis.heart}`,
        iconURL: user.displayAvatarURL()
    });

    return embed;
}

/**
 * Create an enhanced queue embed with multiple tracks
 * @param {array} tracks - Array of track objects
 * @param {number} page - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {object} currentTrack - Currently playing track
 * @param {object} options - Additional options
 * @returns {EmbedBuilder} The configured queue embed
 */
function createQueueEmbed(tracks, page, totalPages, currentTrack = null, options = {}) {
    const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle(`${config.emojis.queue} Music Queue ${config.emojis.note}`)
        .setTimestamp();

    if (tracks.length === 0) {
        embed.setDescription(`${config.emojis.cd} The queue is empty! Use \`/play\` to add some music. ${config.emojis.sparkles}`)
            .setColor(config.colors.info)
            .setFooter({ text: 'Ready to rock? Add your favorite songs!' });
        return embed;
    }

    // Show currently playing track at the top
    let description = '';
    if (currentTrack) {
        description += `${config.emojis.playing} **Now Playing:**\n`;
        description += `${config.emojis.note} **[${currentTrack.title}](${currentTrack.url})**\n`;
        description += `${config.emojis.headphones} \`${currentTrack.duration}\` • ${currentTrack.requestedBy}\n\n`;
    }

    description += `${config.emojis.vinyl} **Up Next:**\n`;

    const trackList = tracks.map((track, index) => {
        const position = (page - 1) * 10 + index + 1;
        const positionEmoji = position === 1 ? config.emojis.crown : 
                             position === 2 ? config.emojis.gem : 
                             position === 3 ? config.emojis.star : 
                             config.emojis.note;

        return `${positionEmoji} \`${position}.\` **[${track.title}](${track.url})**\n` +
               `${config.emojis.headphones} \`${track.duration}\` • ${track.requestedBy}`;
    }).join('\n\n');

    description += trackList;
    embed.setDescription(description);

    // Enhanced footer with more information
    const totalDuration = calculateTotalDuration(tracks);
    embed.setFooter({ 
        text: `${config.emojis.rainbow} Page ${page}/${totalPages} • ${tracks.length} song(s) • Total: ${totalDuration}`
    });

    return embed;
}

/**
 * Create a progress bar embed for currently playing track
 * @param {object} track - Current track
 * @param {object} queue - Queue object
 * @returns {EmbedBuilder} Progress bar embed
 */
function createProgressEmbed(track, queue, options = {}) {
    const progress = queue.node.createProgressBar({
        length: config.embedStyles.progressBar.length,
        timecodes: true,
        queue: false
    });

    const embed = new EmbedBuilder()
        .setColor(options.transparent ? config.colors.transparentPrimary : config.colors.accent)
        .setTitle(options.transparent ? 
            `✧･ﾟ: *✧･ﾟ:* ${config.emojis.headphones} Now Playing *:･ﾟ✧*:･ﾟ✧` :
            `${config.emojis.headphones} Now Playing`)
        .setDescription(options.transparent ?
            `╭─────── ✦ ─────── ✦ ───────╮\n${config.emojis.note} **[${track.title}](${track.url})**\n╰─────── ✦ ─────── ✦ ───────╯\n\n${config.emojis.zap} **Progress:**\n${progress}` :
            `${config.emojis.note} **[${track.title}](${track.url})**\n\n${config.emojis.zap} **Progress:**\n${progress}`)
        .addFields(
            {
                name: `${config.emojis.volume} Volume`,
                value: `\`${queue.node.volume}%\``,
                inline: true
            },
            {
                name: `${config.emojis.repeat} Loop`,
                value: queue.repeatMode === 0 ? '`Off`' : 
                       queue.repeatMode === 1 ? '`Track`' : '`Queue`',
                inline: true
            },
            {
                name: `${config.emojis.queue} Queue`,
                value: `\`${queue.tracks.data.length} song(s)\``,
                inline: true
            }
        )
        .setThumbnail(track.thumbnail)
        .setFooter({ 
            text: `${queue.node.isPaused() ? config.emojis.paused + ' Paused' : config.emojis.playing + ' Playing'} • ${track.requestedBy.username}`,
            iconURL: track.requestedBy.displayAvatarURL()
        })
        .setTimestamp();

    return embed;
}

/**
 * Create theme selection embed
 * @param {string} currentTheme - Currently active theme
 * @returns {EmbedBuilder} Theme selection embed
 */
function createThemeEmbed(currentTheme) {
    const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle(`${config.emojis.rainbow} Theme Selection`)
        .setDescription('Choose your preferred theme for the music bot embeds!')
        .setTimestamp();

    const themeFields = Object.keys(config.themes).map(themeName => {
        const theme = config.themes[themeName];
        const isActive = themeName === currentTheme;
        const status = isActive ? `${config.emojis.crown} **Active**` : 'Available';

        return {
            name: `${isActive ? config.emojis.star : config.emojis.gem} ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`,
            value: `${status}\nPrimary: \`${theme.colors.primary}\`\nAccent: \`${theme.colors.accent}\``,
            inline: true
        };
    });

    embed.addFields(themeFields);
    embed.setFooter({ text: 'Use /theme <name> to change themes!' });

    return embed;
}

// Helper functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function calculateTotalDuration(tracks) {
    // Simple calculation - in a real implementation, you'd parse the duration strings
    return `${tracks.length * 3.5}m`; // Estimated average
}

/**
 * Create control buttons for music player
 * @returns {ActionRowBuilder} Button row
 */
function createMusicControls() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('music_previous')
                .setLabel('Previous')
                .setEmoji(config.emojis.previous)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('music_pause')
                .setLabel('Pause')
                .setEmoji(config.emojis.paused)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('music_skip')
                .setLabel('Skip')
                .setEmoji(config.emojis.skip)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('music_stop')
                .setLabel('Stop')
                .setEmoji(config.emojis.stopped)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('music_queue')
                .setLabel('Queue')
                .setEmoji(config.emojis.queue)
                .setStyle(ButtonStyle.Success)
        );

    return row;
}

module.exports = {
    createEmbed,
    createMusicEmbed,
    createQueueEmbed,
    createProgressEmbed,
    createThemeEmbed,
    createMusicControls,
    formatNumber,
    calculateTotalDuration
};