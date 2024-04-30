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
    Asynchronous function to initialyze :
    - The database connection
    - Deploy the commands
    - The commands and events handlers

*/
const Initialize = async () => {
    // Deploy the commands
    await require('./handler/deploy-commands.js').init();

    /*
        Initialize the commands and events handlers
        @param {Client} client - The discord client
        @param {Boolean} DEBUG_MODE - Print events and commands loaded
    */
    const DEBUG_MODE = true; // Print events and commands loaded
    await require('./handler/commands.js').init(client, DEBUG_MODE);
    await require('./handler/events.js').init(client, DEBUG_MODE);

    /*
        Connect to the database
        @param {String} connect - The mongodb connection URI
    */
        await require('./database/mongOption.js').init(connect);

    await client.login(token);
}


try {
    // call the Initialize function
    Initialize();
} catch (error) {
    console.error('[client]: Error logging in:', error);
}