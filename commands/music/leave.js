const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { createEmbed } = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave the voice channel and stop playing music'),
    
    async execute(interaction) {
        try {
            const member = interaction.member;
            const voiceChannel = member.voice.channel;
            const botVoiceChannel = interaction.guild.members.me.voice.channel;

            if (!botVoiceChannel) {
                return await interaction.reply({
                    embeds: [createEmbed('warning', 'Not Connected', 'I\'m not connected to any voice channel!')],
                    ephemeral: true
                });
            }

            if (voiceChannel && voiceChannel.id !== botVoiceChannel.id) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Different Channel', 
                        'You need to be in the same voice channel as me to use this command!')],
                    ephemeral: true
                });
            }

            const player = useMainPlayer();
            const queue = player.nodes.get(interaction.guild);

            // Stop music and clear queue if exists
            if (queue) {
                queue.delete();
            }

            // Leave voice channel
            try {
                botVoiceChannel.leave();
                
                await interaction.reply({
                    embeds: [createEmbed('success', 'Left Voice Channel', 
                        `👋 Successfully left **${botVoiceChannel.name}** and stopped the music!`)]
                });

            } catch (error) {
                console.error('Error leaving voice channel:', error);
                await interaction.reply({
                    embeds: [createEmbed('error', 'Disconnect Failed', 'Failed to leave the voice channel. Please try again.')],
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Leave command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while trying to leave the voice channel.')],
                ephemeral: true
            });
        }
    }
};
