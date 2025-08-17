/**
 * Validate if user is in a voice channel and bot has permissions
 * @param {object} interaction - Discord interaction object
 * @returns {object} Validation result with success boolean and message
 */
function validateVoiceChannel(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;
    const botVoiceChannel = interaction.guild.members.me.voice.channel;

    // Check if user is in a voice channel
    if (!voiceChannel) {
        return {
            success: false,
            message: 'You need to be in a voice channel to use this command!'
        };
    }

    // Check if bot is in a different voice channel
    if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return {
            success: false,
            message: 'You need to be in the same voice channel as me to use this command!'
        };
    }

    // Check bot permissions in voice channel
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    
    if (!permissions.has('Connect')) {
        return {
            success: false,
            message: 'I don\'t have permission to connect to your voice channel!'
        };
    }

    if (!permissions.has('Speak')) {
        return {
            success: false,
            message: 'I don\'t have permission to speak in your voice channel!'
        };
    }

    return {
        success: true,
        voiceChannel: voiceChannel
    };
}

/**
 * Validate if there's an active music queue
 * @param {object} queue - Discord-player queue object
 * @returns {object} Validation result with success boolean and message
 */
function validateQueue(queue) {
    if (!queue) {
        return {
            success: false,
            message: 'There is no music playing in this server!'
        };
    }

    if (!queue.isPlaying()) {
        return {
            success: false,
            message: 'There is no music currently playing!'
        };
    }

    return {
        success: true,
        queue: queue
    };
}

/**
 * Validate if user has DJ permissions (optional - for future use)
 * @param {object} member - Discord member object
 * @param {object} queue - Discord-player queue object
 * @returns {object} Validation result with success boolean and message
 */
function validateDJPermissions(member, queue) {
    // Check if user is the track requester
    if (queue.currentTrack && queue.currentTrack.requestedBy.id === member.id) {
        return { success: true };
    }

    // Check if user has manage channels permission
    if (member.permissions.has('ManageChannels')) {
        return { success: true };
    }

    // Check if user has a DJ role (customize role name as needed)
    const djRole = member.roles.cache.find(role => 
        role.name.toLowerCase().includes('dj') || 
        role.name.toLowerCase().includes('music')
    );

    if (djRole) {
        return { success: true };
    }

    // Check if user is alone with the bot in voice channel
    const voiceChannel = member.voice.channel;
    if (voiceChannel && voiceChannel.members.size <= 2) {
        return { success: true };
    }

    return {
        success: false,
        message: 'You need DJ permissions to use this command!'
    };
}

/**
 * Validate search query
 * @param {string} query - Search query string
 * @returns {object} Validation result with success boolean and message
 */
function validateQuery(query) {
    if (!query || query.trim().length === 0) {
        return {
            success: false,
            message: 'Please provide a valid search query or URL!'
        };
    }

    if (query.length > 500) {
        return {
            success: false,
            message: 'Search query is too long! Please keep it under 500 characters.'
        };
    }

    return {
        success: true,
        query: query.trim()
    };
}

/**
 * Validate volume level
 * @param {number} volume - Volume level
 * @returns {object} Validation result with success boolean and message
 */
function validateVolume(volume) {
    if (isNaN(volume)) {
        return {
            success: false,
            message: 'Volume must be a number!'
        };
    }

    if (volume < 0 || volume > 100) {
        return {
            success: false,
            message: 'Volume must be between 0 and 100!'
        };
    }

    return {
        success: true,
        volume: volume
    };
}

module.exports = {
    validateVoiceChannel,
    validateQueue,
    validateDJPermissions,
    validateQuery,
    validateVolume
};
