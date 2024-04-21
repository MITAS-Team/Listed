const { Events } = require('discord.js');
const blacklist = require('../database/schema/Blacklist.model.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Find the blacklisted user by their ID
            const blacklistedUser = await blacklist.findOne({ 'user.ID': member.id });

            // If the user is blacklisted, kick them from the server
            if (blacklistedUser) {
                await member.kick('User is blacklisted.');
            }
        } catch (error) {
            console.error("[GuildMemberAdd] Error checking the blacklist:", error);
        }
    },
};
