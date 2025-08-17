# Overview

This is a Discord music bot built with Node.js that provides music playback functionality for Discord servers. The bot allows users to play music from YouTube in voice channels using slash commands. It features a comprehensive set of music controls including play, pause, skip, queue management, and volume control, all wrapped in a clean command structure with Discord embeds for user interaction.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Bot Framework
- **Discord.js v14**: Core Discord API library providing bot functionality and slash command support
- **Discord-player v7**: Music playback library handling audio streaming and queue management
- **YouTube Integration**: Uses discord-player-youtubei extractor for YouTube audio streaming

## Command System
- **Modular Command Structure**: Commands organized in `/commands/music/` directory with individual files for each command
- **Slash Command Implementation**: All interactions use Discord's slash command system for modern user experience
- **Command Registration**: Automatic command discovery and registration on bot startup

## Music Player Architecture
- **Queue-based Playback**: Centralized queue management per Discord guild
- **Voice Channel Integration**: Automatic voice channel connection and permission validation
- **Track Management**: Support for play, pause, skip, shuffle, repeat modes, and volume control

## Validation Layer
- **Voice Channel Validation**: Ensures users are in appropriate voice channels before command execution
- **Permission Checking**: Validates bot permissions for voice channel access
- **Queue State Validation**: Consistent queue existence and state checking across commands

## User Interface
- **Discord Embeds**: Standardized embed system with color-coded messages (success, error, warning, info)
- **Rich Music Information**: Detailed track information display with progress bars and metadata
- **Paginated Queue Display**: Queue visualization with pagination support for large playlists

## Event System
- **Ready Event**: Bot initialization, command registration, and status setting
- **Interaction Handling**: Centralized slash command processing with error handling
- **Error Management**: Comprehensive error catching and user-friendly error messages

## Configuration Management
- **Environment Variables**: Bot token and client ID configuration through environment variables
- **Customizable Settings**: Volume limits, queue size limits, embed colors, and emoji configuration
- **Guild vs Global Commands**: Configurable command scope for development and production

# External Dependencies

## Core Dependencies
- **discord.js**: Discord API wrapper for bot functionality
- **discord-player**: Music streaming and queue management library
- **discord-player-youtubei**: YouTube audio extraction service

## Runtime Environment
- **Node.js**: JavaScript runtime environment
- **Process Environment Variables**: DISCORD_TOKEN, CLIENT_ID, and GUILD_ID for bot authentication

## Discord Integrations
- **Discord Gateway**: Real-time event handling and bot presence
- **Discord Voice**: Voice channel connection and audio streaming
- **Discord Slash Commands**: Modern command interface registration and handling

## Music Sources
- **YouTube**: Primary music source through youtubei extractor
- **Auto Search**: Automatic query type detection for URLs and search terms