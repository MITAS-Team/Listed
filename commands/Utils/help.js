// Import necessary modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { findBestMatch } = require('string-similarity'); // Import the string-similarity module

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands.')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to get help for.')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const commandHelp = interaction.options.getString('command');

            const commandsPath = path.join(__dirname, '..', '..', 'commands');
            const commandFolders = fs.readdirSync(commandsPath);

            // Create an object to store categories and commands
            const commandsByCategory = {};

            // Loop through each folder and get the JavaScript files in each folder
            for (const folder of commandFolders) {
                const commandFiles = fs
                    .readdirSync(path.join(commandsPath, folder))
                    .filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(path.join(commandsPath, folder, file));
                    // Check if the command has a data property
                    if ('data' in command) {
                        // Initialize the category array if it doesn't exist
                        if (!commandsByCategory[folder]) {
                            commandsByCategory[folder] = [];
                        }
                        // Add the command to the corresponding category
                        commandsByCategory[folder].push(command.data.toJSON());
                    }
                }
            }

            if (commandHelp) {
                // Find the command by name
                let foundCommand;
                let usage = '';
                let commandFound = false; // Flag to check if command is found
                for (const category in commandsByCategory) {
                    const commands = commandsByCategory[category];
                    // Find the command in the category
                    foundCommand = commands.find(command => command.name === commandHelp);
                    if (foundCommand) {
                        // Construct the usage string based on the command options and whether they are required or not
                        usage = `/${foundCommand.name} ${foundCommand.options.map(option => option.required ? `<${option.name}>` : `[${option.name}]`).join(' ')}`;
                        
                        const embed = new EmbedBuilder()
                            .setTitle('Help')
                            .setDescription(`Help for the ${commandHelp} command:`)
                            .addFields(
                                { name: 'Description', value: foundCommand.description || 'No description available' },
                                { name: 'Usage', value: `\`${usage}\` \n <> = required, [] = optional` },
                            )
                            .setColor('DarkGreen');
                        
                        await interaction.reply({ embeds: [embed] });
                        commandFound = true; // Set flag to true
                        break; // Exit loop once command is found
                    }
                }
                
                // If the command is not found in any category, find the closest matching command
                if (!commandFound) {
                    const allCommands = Object.values(commandsByCategory).flatMap(commands => commands);
                    const matches = findBestMatch(commandHelp, allCommands.map(command => command.name));
                    const closestMatch = matches.bestMatch.target;
                    
                    await interaction.reply({ content: `Command \`${commandHelp}\` not found. Did you mean: \`${closestMatch}\`?`, ephemeral: true });
                }
            } else {
                // Prepare the embed
                const embed = new EmbedBuilder()
                    .setTitle('Help')
                    .setDescription('List of the available commands:')
                    .setColor('DarkGreen');
            
                // Add fields for each category
                for (const category in commandsByCategory) {
                    const commands = commandsByCategory[category];
                    const commandNames = commands.map(command => `${command.name}`).join('\n');
                
                    embed.addFields({
                        name: category,
                        value: commandNames,
                        inline: true,
                    });
                }
            
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('[help]: Error executing command:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true }); 
        }
    },
};
