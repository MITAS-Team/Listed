const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`\x1b[92m[events]: ${client.user.tag} is up\x1b[0m`);
	},
};
