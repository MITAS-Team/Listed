const { Events } = require('discord.js');
const Guild = require("../database/schema/Guild.model.js");

module.exports = {
	name: Events.GuildDelete,
	async execute(guild) {
        try {
            await Guild.findOneAndDelete({ ID: guild.id });
            console.log(`\x1b[92m[guildDelete]: Guild ${guild.id} deleted from the database.\x1b[0m`);
        } catch (error) {
            console.error(`\x1b[92m[guildDelete]: Error deleting the guild from the DB\x1b[0m`, error);
        }
	},
};
