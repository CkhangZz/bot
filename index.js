require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Create Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

// Create music player instance  
const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        filter: 'audioonly'
    },
    ffmpegPath: require('ffmpeg-static'),
    skipFFmpeg: false,
    smoothVolume: true,
    useLegacyFFmpeg: false
});

// Register YouTube extractor
player.extractors.register(YoutubeiExtractor, {});

// Add error handling for player
player.events.on('error', (queue, error) => {
    console.log(`General player error in ${queue.guild.name}:`, error.message);
});

player.events.on('playerError', (queue, error) => {
    console.log(`Player error in ${queue.guild.name}:`, error.message);
});

player.events.on('audioTrackAdd', (queue, track) => {
    console.log(`Added track: ${track.title} in ${queue.guild.name}`);
});

player.events.on('playerStart', (queue, track) => {
    console.log(`🎵 Started playing: ${track.title} in ${queue.guild.name}`);
    console.log(`🔊 Current volume: ${queue.node.volume}%`);
});

player.events.on('disconnect', (queue) => {
    console.log(`Disconnected from ${queue.guild.name}`);
});

player.events.on('emptyChannel', (queue) => {
    console.log(`Left empty channel in ${queue.guild.name}`);
});

player.events.on('emptyQueue', (queue) => {
    console.log(`Queue finished in ${queue.guild.name}`);
});

player.events.on('connection', (queue) => {
    console.log(`Connected to voice channel in ${queue.guild.name}`);
});

// Disable debug for cleaner logs
// player.events.on('debug', (queue, message) => {
//     console.log(`[DEBUG] ${queue.guild.name}: ${message}`);
// });

// Handle specific voice connection issues
player.events.on('connectionError', (queue, error) => {
    console.log(`Voice connection error in ${queue.guild.name}:`, error.message);
});

player.events.on('connectionDestroyed', (queue) => {
    console.log(`Voice connection destroyed in ${queue.guild.name}`);
});

// Add audio player state monitoring
player.events.on('audioTrackStart', (queue, track) => {
    console.log(`🎵 Audio track started: ${track.title}`);
});

player.events.on('playerSkip', (queue, track) => {
    console.log(`⏭️ Skipped: ${track.title} in ${queue.guild.name}`);
});

player.events.on('playerPause', (queue, track) => {
    console.log(`⏸️ Paused: ${track.title} in ${queue.guild.name}`);
});

player.events.on('playerResume', (queue, track) => {
    console.log(`▶️ Resumed: ${track.title} in ${queue.guild.name}`);
});

// Initialize commands collection
client.commands = new Collection();

// Load command files
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(__dirname, 'commands', folder, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Load event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Make player accessible globally
client.player = player;

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
