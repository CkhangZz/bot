
const { Events, REST, Routes } = require('discord.js');
const config = require('../config');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} is online and ready!`);

        // Set bot activity
        client.user.setActivity('🎵 Music for everyone!', { type: 'LISTENING' });

        // Register slash commands
        const commands = [];

        // Collect commands
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        // Register commands
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            console.log('🔄 Started refreshing application (/) commands.');

            // Check if APPLICATION_ID exists
            if (!process.env.APPLICATION_ID) {
                console.error('❌ APPLICATION_ID not found in environment variables');
                return;
            }

            await rest.put(
                Routes.applicationCommands(process.env.APPLICATION_ID),
                { body: commands }
            );

            console.log(`✅ Successfully reloaded ${commands.length} application (/) commands.`);
        } catch (error) {
            console.error('❌ Error refreshing commands:', error);
        }
    }
};
