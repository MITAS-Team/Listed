// import env variable
require('dotenv').config();
const { token, connect } = process.env;

/*
    Creating the client
*/
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.commands = new Collection();
/*
    Connect to the database
    @param {String} connect - The mongodb connection URI
*/
require('./database/mongOption.js').init(connect);

// Deploy the commands
require('./handler/deploy-commands.js').init();

/*
    Initialize the commands and events handlers
    @param {Client} client - The discord client
    @param {Boolean} DEBUG_MODE - Print events and commands loaded
*/
const DEBUG_MODE = true; // Print events and commands loaded
require('./handler/commands.js').init(client, DEBUG_MODE);
require('./handler/events.js').init(client, DEBUG_MODE);


try {
    // Login the client
    client.login(token);
} catch (error) {
    console.error('[client]: Error logging in:', error);
}