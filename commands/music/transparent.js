
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');
const config = require('../../config');

// Store transparent mode state (in production, use database)
let transparentMode = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transparent')
        .setDescription('Bật/tắt chế độ embed trong suốt')
        .addBooleanOption(option =>
            option.setName('enabled')
                .setDescription('Bật hoặc tắt chế độ transparent')
                .setRequired(false)
        ),

    async execute(interaction) {
        const enabled = interaction.options.getBoolean('enabled');
        
        if (enabled !== null) {
            transparentMode = enabled;
        } else {
            transparentMode = !transparentMode;
        }

        const statusText = transparentMode ? 'BẬT' : 'TẮT';
        const statusEmoji = transparentMode ? config.emojis.sparkles : config.emojis.stopped;

        const embed = createEmbed(
            'success',
            `${statusEmoji} Chế độ Transparent`,
            `Chế độ embed trong suốt đã được **${statusText}**`,
            {
                transparent: transparentMode,
                fields: [
                    {
                        name: `${config.emojis.rainbow} Hiệu ứng`,
                        value: transparentMode ? 
                            'Embeds sẽ có hiệu ứng trong suốt đẹp mắt với viền đặc biệt' :
                            'Embeds sẽ hiển thị ở chế độ bình thường',
                        inline: false
                    },
                    {
                        name: `${config.emojis.zap} Tính năng`,
                        value: transparentMode ?
                            '• Màu sắc mờ ảo\n• Viền trang trí\n• Hiệu ứng glass\n• Text styling đặc biệt' :
                            '• Màu sắc đậm\n• Giao diện chuẩn\n• Tối ưu hiệu năng',
                        inline: false
                    }
                ],
                footer: {
                    text: `${config.emojis.gem} Thử nghiệm các lệnh khác để thấy hiệu ứng!`,
                    iconURL: interaction.user.displayAvatarURL()
                },
                thumbnail: interaction.client.user.displayAvatarURL()
            }
        );

        await interaction.reply({ embeds: [embed] });
        
        // Store the state globally for other commands to use
        global.transparentMode = transparentMode;
    },

    // Export transparent mode state
    getTransparentMode: () => transparentMode
};
