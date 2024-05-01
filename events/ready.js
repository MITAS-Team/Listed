const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`\x1b[92m[events]: ${client.user.tag} is up\x1b[0m`);

		// Set the bot's presence
		client.user.setPresence({
			// Set the status to online
			status: PresenceUpdateStatus.Online,
			// Set the activity to listening to /help
			activities: [
				{
					name: '/help',
					type: ActivityType.LISTENING,
				},
			],
		});
	},
};
