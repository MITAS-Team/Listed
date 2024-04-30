const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    init: async (client, DEBUG_MODE) => {
        const eventsPath = path.join(__dirname, '..', 'events');
        const eventFiles = fs
            .readdirSync(eventsPath)
            .filter(file => file.endsWith('.js'));
        
        for (const file of eventFiles) {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
                if (DEBUG_MODE) {
                    console.log(`\x1b[93m[events]: ${event.name} loaded once\x1b[0m`);
                }
            } else {
                client.on(event.name, (...args) => event.execute(...args));
                if (DEBUG_MODE) {
                    console.log(`\x1b[93m[events]: ${event.name} loaded\x1b[0m`);
                }
            }
        }
    },
};
