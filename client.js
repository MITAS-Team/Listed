// import env variable
require('dotenv').config();
const { token, connect } = process.env;

// Initialize the connection to mongoDB
require('./database/mongOption.js').init(connect);
require('./deploy-commands.js').init();

const DEBUG_MODE = true;

/*
    Creating the client
*/
const { Client, Collection, GatewayIntentBits, } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
});

client.commands = new Collection();

/*
    Events and Commands handler 
*/
const fs = require('node:fs');
const path = require('node:path');

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

// Function to load commands dynamically
const loadCommands = () => {
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
};

// Function to load events dynamically
const loadEvents = () => {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
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
};

// Initial loading of commands and events
loadCommands();
loadEvents();


// Login the client
client.login(token);
