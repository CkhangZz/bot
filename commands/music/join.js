const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join your voice channel'),
    
    async execute(interaction) {
        try {
            const member = interaction.member;
            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'No Voice Channel', 'You need to be in a voice channel first!')],
                    ephemeral: true
                });
            }

            const permissions = voiceChannel.permissionsFor(interaction.client.user);
            
            if (!permissions.has('Connect')) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Missing Permissions', 'I don\'t have permission to connect to that voice channel!')],
                    ephemeral: true
                });
            }

            if (!permissions.has('Speak')) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Missing Permissions', 'I don\'t have permission to speak in that voice channel!')],
                    ephemeral: true
                });
            }

            // Check if bot is already in a voice channel in this guild
            const botVoiceChannel = interaction.guild.members.me.voice.channel;
            
            if (botVoiceChannel) {
                if (botVoiceChannel.id === voiceChannel.id) {
                    return await interaction.reply({
                        embeds: [createEmbed('warning', 'Already Connected', 'I\'m already in your voice channel!')],
                        ephemeral: true
                    });
                } else {
                    return await interaction.reply({
                        embeds: [createEmbed('warning', 'Already Connected', `I'm already connected to **${botVoiceChannel.name}**!`)],
                        ephemeral: true
                    });
                }
            }

            try {
                // Connect to voice channel
                await voiceChannel.join();
                
                await interaction.reply({
                    embeds: [createEmbed('success', 'Joined Voice Channel', 
                        `🎤 Successfully joined **${voiceChannel.name}**!`)]
                });

            } catch (error) {
                console.error('Error joining voice channel:', error);
                await interaction.reply({
                    embeds: [createEmbed('error', 'Connection Failed', 'Failed to join the voice channel. Please try again.')],
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Join command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while trying to join the voice channel.')],
                ephemeral: true
            });
        }
    }
};
