// Import necessary modules
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands.'),
    async execute(interaction) {
        try {
            // get the pth to the commands folder
            const commandsPath = path.join(__dirname, '..', '..', 'commands');
            // get all the folders in the commands folder
            const commandFolders = fs.readdirSync(commandsPath);

            // create an array to store the commands and categories
            const commands = [];
            const categories = [];
    
            // loop through each folder and get the javascript files in each folder
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(path.join(commandsPath, folder, file));
                    // check if the command has a data property
                    if ('data' in command) {
                        // add the command to the commands array
                        commands.push(command.data.toJSON());
                        categories.push(folder);
                    }
                }
            }

            categories
                .filter((item, pos, self) => {
                    return self.indexOf(item) == pos;
                })
                .forEach(categorie => {
                    categories.push(categorie)
                })
            const embeds = new EmbedBuilder()
                .setTitle('Help')
                .setDescription('Here are the available commands:')
                .addFields({
                    name: 'Categories',
                    value: categories.join('\n'),
                    inline: true,
                }, {
                    name: 'Commands',
                    value: commands.map(command => `\`${command.name}\``).join('\n'),
                    inline: true,
                }, {
                    name: 'Description',
                    value: commands.map(command => command.description).join('\n'),
                    inline: true
                })
                .setColor('DarkGreen')
            await interaction.reply({ embeds: [embeds] });
        } catch (error) {
            console.error('[help]: Error executing command:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true }); 
        }
    },
};
