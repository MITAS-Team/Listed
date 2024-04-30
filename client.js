// import env variable
require('dotenv').config();
const { token, connect } = process.env;
const DEBUG_MODE = true;

/*
    Creating the client
*/
const { Client, Collection, GatewayIntentBits, } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.commands = new Collection();

// Initialize the connection to mongoDB
require('./database/mongOption.js').init(connect);

// Deploy the commands
require('./handler/deploy-commands.js').init();

// Initialize the commands and events handlers
require('./handler/commands.js').init(client, DEBUG_MODE);
require('./handler/events.js').init(client, DEBUG_MODE);


// Login the client
client.login(token);
