
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, createThemeEmbed } = require('../../utils/embedBuilder');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('theme')
        .setDescription('Change the bot\'s embed theme')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Theme name to switch to')
                .setRequired(false)
                .addChoices(
                    { name: 'Default', value: 'default' },
                    { name: 'Dark', value: 'dark' },
                    { name: 'Cyberpunk', value: 'cyberpunk' },
                    { name: 'Ocean', value: 'ocean' }
                )),

    async execute(interaction) {
        try {
            const themeName = interaction.options.getString('name');

            if (!themeName) {
                // Show theme selection
                const embed = createThemeEmbed(config.activeTheme);
                return await interaction.reply({ embeds: [embed] });
            }

            if (!config.themes[themeName]) {
                return await interaction.reply({
                    embeds: [createEmbed('error', 'Invalid Theme', `Theme "${themeName}" does not exist!`)],
                    ephemeral: true
                });
            }

            // Switch theme
            config.activeTheme = themeName;
            const theme = config.themes[themeName];

            const embed = createEmbed('success', 
                `${config.emojis.rainbow} Theme Changed!`, 
                `Successfully switched to **${themeName}** theme!`, {
                    emoji: config.emojis.sparkles,
                    fields: [
                        {
                            name: `${config.emojis.gem} Primary Color`,
                            value: `\`${theme.colors.primary}\``,
                            inline: true
                        },
                        {
                            name: `${config.emojis.star} Accent Color`,
                            value: `\`${theme.colors.accent}\``,
                            inline: true
                        },
                        {
                            name: `${config.emojis.zap} Status`,
                            value: '`Active`',
                            inline: true
                        }
                    ],
                    footer: {
                        customText: `Theme: ${themeName} • Enjoy the new look!`
                    }
                });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Theme command error:', error);
            await interaction.reply({
                embeds: [createEmbed('error', 'Error', 'An error occurred while changing the theme.')],
                ephemeral: true
            });
        }
    }
};
