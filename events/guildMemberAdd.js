const { Events } = require('discord.js');
const blacklist = require('../database/schema/Blacklist.model.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Send a direct message to the member upon joining
            await member.send("Hello, welcome to the server!");

            // Find the blacklisted user by their ID
            const blacklistedUser = await blacklist.findOne({ userID: member.id });
            console.log(member.id);
            console.log(blacklistedUser);

            // If the user is blacklisted, kick them from the server
            if (blacklistedUser) {
                await member.send('You are blacklisted and cannot join this server.');
                await member.kick('User is blacklisted.');
                // Log the attempt of the blacklisted user to join
                console.log(`[GuildMemberAdd] Blacklisted user attempt to join: ${member.id}`);
            }
        } catch (error) {
            console.error("[GuildMemberAdd] Error checking the blacklist:", error);
        }
    },
};
