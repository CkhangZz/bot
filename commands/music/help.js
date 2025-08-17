
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiển thị danh sách tất cả các lệnh music bot'),

    async execute(interaction) {
        const helpEmbed = createEmbed('primary', `${config.emojis.sparkles} Music Bot Commands`, 
            'Dưới đây là tất cả các lệnh bạn có thể sử dụng:', {
            thumbnail: interaction.client.user.displayAvatarURL(),
            fields: [
                {
                    name: `${config.emojis.playing} **Phát nhạc**`,
                    value: `${config.emojis.note} \`/play <tên bài/URL>\` - Phát nhạc từ YouTube\n` +
                           `${config.emojis.queue} \`/queue [page]\` - Xem danh sách chờ\n` +
                           `${config.emojis.headphones} \`/nowplaying\` - Xem bài đang phát`,
                    inline: false
                },
                {
                    name: `${config.emojis.gear} **Điều khiển**`,
                    value: `${config.emojis.paused} \`/pause\` - Tạm dừng nhạc\n` +
                           `${config.emojis.playing} \`/resume\` - Tiếp tục phát nhạc\n` +
                           `${config.emojis.skip} \`/skip\` - Bỏ qua bài hiện tại\n` +
                           `${config.emojis.stopped} \`/stop\` - Dừng và xóa queue\n` +
                           `${config.emojis.volume} \`/volume <0-100>\` - Điều chỉnh âm lượng`,
                    inline: false
                },
                {
                    name: `${config.emojis.shuffle} **Quản lý Queue**`,
                    value: `${config.emojis.shuffle} \`/shuffle\` - Trộn ngẫu nhiên queue\n` +
                           `${config.emojis.repeat} \`/repeat <off/track/queue>\` - Chế độ lặp\n` +
                           `${config.emojis.trash} \`/clear\` - Xóa toàn bộ queue`,
                    inline: false
                },
                {
                    name: `${config.emojis.microphone} **Voice Channel**`,
                    value: `${config.emojis.join} \`/join\` - Bot tham gia voice channel\n` +
                           `${config.emojis.leave} \`/leave\` - Bot rời voice channel`,
                    inline: false
                },
                {
                    name: `${config.emojis.rainbow} **Tùy chỉnh**`,
                    value: `${config.emojis.rainbow} \`/theme <tên theme>\` - Thay đổi theme embed\n` +
                           `${config.emojis.sparkles} \`/help\` - Hiển thị menu này`,
                    inline: false
                }
            ],
            footer: {
                text: `${config.emojis.heart} Hãy sử dụng các nút điều khiển trên embed để tương tác nhanh!`,
                iconURL: interaction.user.displayAvatarURL()
            }
        });

        // Thêm thông tin bổ sung
        helpEmbed.addFields({
            name: `${config.emojis.crown} **Tips & Tricks**`,
            value: `${config.emojis.zap} Sử dụng các nút điều khiển trên embed để tương tác nhanh\n` +
                   `${config.emojis.fire} Bot hỗ trợ phát từ YouTube, Spotify, SoundCloud\n` +
                   `${config.emojis.gem} Bạn có thể phát playlist bằng cách paste link playlist\n` +
                   `${config.emojis.star} Dùng \`/theme\` để xem và thay đổi giao diện embed`,
            inline: false
        });

        await interaction.reply({ 
            embeds: [helpEmbed],
            ephemeral: false
        });
    }
};
