const { Events } = require('discord.js');
const { createEmbed, createMusicControls } = require('../utils/embedBuilder');
const config = require('../config');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle button interactions for music controls
        if (interaction.isButton()) {
            const { useMainPlayer } = require('discord-player');
            const player = useMainPlayer();
            const queue = player.nodes.get(interaction.guild);

            if (!queue) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'No Music', 'Không có nhạc nào đang phát!')],
                    flags: 64 // ephemeral: true using flags instead
                });
            }

            try {
                switch (interaction.customId) {
                    case 'music_pause':
                        if (queue.node.isPaused()) {
                            queue.node.resume();
                            await interaction.reply({
                                embeds: [createEmbed('success', `${config.emojis.playing} Resumed`, 'Đã tiếp tục phát nhạc!')],
                                flags: 64
                            });
                        } else {
                            queue.node.pause();
                            await interaction.reply({
                                embeds: [createEmbed('success', `${config.emojis.paused} Paused`, 'Đã tạm dừng nhạc!')],
                                flags: 64
                            });
                        }
                        break;

                    case 'music_skip':
                        queue.node.skip();
                        await interaction.reply({
                            embeds: [createEmbed('success', `${config.emojis.skip} Skipped`, 'Đã bỏ qua bài hiện tại!')],
                            flags: 64
                        });
                        break;

                    case 'music_stop':
                        queue.delete();
                        await interaction.reply({
                            embeds: [createEmbed('success', `${config.emojis.stopped} Stopped`, 'Đã dừng nhạc và xóa queue!')],
                            flags: 64
                        });
                        break;

                    case 'music_queue':
                        const tracks = queue.tracks.data;
                        const { createQueueEmbed } = require('../utils/embedBuilder');
                        const queueEmbed = createQueueEmbed(tracks.slice(0, 10), 1, Math.ceil(tracks.length / 10), queue.currentTrack);

                        await interaction.reply({
                            embeds: [queueEmbed],
                            flags: 64
                        });
                        break;

                    case 'music_previous':
                        if (queue.history.previousTrack) {
                            await queue.history.back();
                            await interaction.reply({
                                embeds: [createEmbed('success', '⏮️ Previous', 'Playing previous track!')],
                                flags: 64
                            });
                        } else {
                            await interaction.reply({
                                embeds: [createEmbed('info', 'No Previous Track', 'There is no previous track in history!')],
                                flags: 64
                            });
                        }
                        break;

                    default:
                        await interaction.reply({
                            embeds: [createEmbed('error', 'Error', 'Nút không được hỗ trợ!')],
                            flags: 64
                        });
                }
            } catch (error) {
                console.error('Button interaction error:', error);
                await interaction.reply({
                    embeds: [createEmbed('error', 'Error', 'Có lỗi xảy ra khi xử lý tương tác!')],
                    flags: 64
                });
            }
            return;
        }

        // Handle slash commands
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);

            const errorEmbed = createEmbed('error', 'Command Error',
                'Có lỗi xảy ra khi thực hiện lệnh này!', {
                transparent: global.transparentMode || false
            });

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    embeds: [errorEmbed],
                    flags: 64
                });
            } else {
                await interaction.reply({
                    embeds: [errorEmbed],
                    flags: 64
                });
            }
        }
    }
};