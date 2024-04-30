const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    init: async (client, DEBUG_MODE) => {
        const commandsPath = path.join(__dirname, '..', 'commands');
        const commandFolders = fs.readdirSync(commandsPath);
        
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, folder, file));
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    if (DEBUG_MODE) {
                        console.log(`\x1b[94m[Commands]: ${command.data.name} loaded\x1b[0m`);
                    }
                } else {
                    console.log(`\x1b[33m[WARNING] The command at ${file} is missing a required "data" or "execute" property.\x1b[0m`);
                }
            }
        }
    },
};
