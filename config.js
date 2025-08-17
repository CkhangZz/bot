module.exports = {
    // Theme system with multiple presets
    themes: {
        default: {
            colors: {
                primary: '#5865F2',
                secondary: '#4752C4',
                success: '#57F287',
                error: '#ED4245',
                warning: '#FEE75C',
                info: '#5865F2',
                accent: '#EB459E',
                background: '#2F3136',
                text: '#FFFFFF',
                // Transparent colors for glass effect
                transparentPrimary: '#5865F280',
                transparentSecondary: '#4752C480',
                transparentSuccess: '#57F28780',
                transparentError: '#ED424580',
                transparentWarning: '#FEE75C80',
                transparentInfo: '#5865F280',
                transparentAccent: '#EB459E80'
            },
            gradient: {
                primary: ['#5865F2', '#4752C4'],
                music: ['#FF6B6B', '#4ECDC4'],
                success: ['#56FFA4', '#59BC86'],
                error: ['#FF6B6B', '#EE5A24']
            }
        },
        dark: {
            colors: {
                primary: '#1a1a1a',
                secondary: '#2d2d2d',
                success: '#28a745',
                error: '#dc3545',
                warning: '#ffc107',
                info: '#17a2b8',
                accent: '#6f42c1',
                background: '#000000',
                text: '#ffffff',
                transparentPrimary: '#1a1a1a80',
                transparentSecondary: '#2d2d2d80',
                transparentSuccess: '#28a74580',
                transparentError: '#dc354580',
                transparentWarning: '#ffc10780',
                transparentInfo: '#17a2b880',
                transparentAccent: '#6f42c180'
            },
            gradient: {
                primary: ['#1a1a1a', '#2d2d2d'],
                music: ['#6f42c1', '#495057'],
                success: ['#28a745', '#20c997'],
                error: ['#dc3545', '#fd7e14']
            }
        },
        cyberpunk: {
            colors: {
                primary: '#00ff88',
                secondary: '#0088ff',
                success: '#00ff88',
                error: '#ff0055',
                warning: '#ffaa00',
                info: '#00aaff',
                accent: '#ff0088',
                background: '#0a0a0a',
                text: '#00ff88',
                transparentPrimary: '#00ff8880',
                transparentSecondary: '#0088ff80',
                transparentSuccess: '#00ff8880',
                transparentError: '#ff005580',
                transparentWarning: '#ffaa0080',
                transparentInfo: '#00aaff80',
                transparentAccent: '#ff008880'
            },
            gradient: {
                primary: ['#00ff88', '#0088ff'],
                music: ['#ff0088', '#00ff88'],
                success: ['#00ff88', '#00aaff'],
                error: ['#ff0055', '#ffaa00']
            }
        },
        ocean: {
            colors: {
                primary: '#0077be',
                secondary: '#004c8c',
                success: '#00a8cc',
                error: '#ff6b6b',
                warning: '#feca57',
                info: '#54a0ff',
                accent: '#5f27cd',
                background: '#192a56',
                text: '#dcdde1',
                transparentPrimary: '#0077be80',
                transparentSecondary: '#004c8c80',
                transparentSuccess: '#00a8cc80',
                transparentError: '#ff6b6b80',
                transparentWarning: '#feca5780',
                transparentInfo: '#54a0ff80',
                transparentAccent: '#5f27cd80'
            },
            gradient: {
                primary: ['#0077be', '#004c8c'],
                music: ['#00a8cc', '#0077be'],
                success: ['#00a8cc', '#54a0ff'],
                error: ['#ff6b6b', '#feca57']
            }
        }
    },

    // Current active theme
    activeTheme: 'default',

    // Get current theme colors
    get colors() {
        return this.themes[this.activeTheme].colors;
    },

    // Get current theme gradients
    get gradients() {
        return this.themes[this.activeTheme].gradient;
    },

    // Enhanced emojis with more variety
    emojis: {
        music: '🎵',
        playing: '▶️',
        paused: '⏸️',
        stopped: '⏹️',
        queue: '📋',
        volume: '🔊',
        volumeMute: '🔇',
        repeat: '🔁',
        repeatOne: '🔂',
        shuffle: '🔀',
        skip: '⏭️',
        previous: '⏮️',
        note: '🎶',
        headphones: '🎧',
        speaker: '🔈',
        microphone: '🎤',
        guitar: '🎸',
        drum: '🥁',
        trumpet: '🎺',
        vinyl: '💿',
        cd: '💽',
        radio: '📻',
        star: '⭐',
        heart: '❤️',
        fire: '🔥',
        sparkles: '✨',
        crown: '👑',
        gem: '💎',
        rocket: '🚀',
        zap: '⚡',
        rainbow: '🌈'
    },

    // Embed styling options
    embedStyles: {
        thumbnail: {
            size: 'large', // small, medium, large
            corner: 'rounded' // sharp, rounded, circle
        },
        footer: {
            showTimestamp: true,
            showGuildName: true,
            showBotInfo: true
        },
        fields: {
            inline: true,
            maxPerRow: 3
        },
        progressBar: {
            length: 25,
            filledChar: '█',
            emptyChar: '░',
            showPercentage: true
        }
    }
};