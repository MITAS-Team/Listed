// Import necessary modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands.'),
    async execute(interaction) {
        try {
            // Get the path to the commands folder
            const commandsPath = path.join(__dirname, '..', '..', 'commands');
            // Get all the folders in the commands folder
            const commandFolders = fs.readdirSync(commandsPath);

            // Create an object to store categories and commands
            const commandsByCategory = {};

            // Loop through each folder and get the JavaScript files in each folder
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
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

            // Prepare the embed
            const embed = new EmbedBuilder()
                .setTitle('Help')
                .setDescription('Here are the available commands:');

            // Add fields for each category
            for (const category in commandsByCategory) {
                const commands = commandsByCategory[category];
                const commandNames = commands.map(command => `\`${command.name}\``).join('\n');
                const commandDescriptions = commands.map(command => command.description).join('\n');

                embed.addFields({
                    name: category,
                    value: commandNames,
                    inline: true,
                });
            }

            // Set embed color and send the message
            embed.setColor('DarkGreen');
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('[help]: Error executing command:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true }); 
        }
    },
};
