const fs = require('fs');
const path = require('path');

module.exports = {
    commands: async () => {
        const commandsPath = path.join(__dirname, '..', 'commands');
        const commandFolders = fs.readdirSync(commandsPath);
        const commandNames = [];

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(path.join(commandsPath, folder))
                .filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const commandName = require(path.join(commandsPath, folder, file)).data.name;
                if (commandName) {
                    commandNames.push(commandName);
                }
            }
        }

        return commandNames;
    },
};
