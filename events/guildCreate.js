const { Events, EmbedBuilder } = require('discord.js');
const Guild = require("../database/schema/Guild.model.js");

module.exports = {
	name: Events.GuildCreate,
	async execute(guild) {
        try {
            const newGuild = new Guild({
                ID: guild.id,
                Settings: {
                    LogChannel: 'None' // Default to None
                }
            });

            await newGuild.save();
            console.log(`\x1b[92m[guildCreate]: Guild ${guild.id} added to the database.\x1b[0m`);
        } catch (error) {
            console.error(`\x1b[92m[guildCreate]: Error saving guild ${guild.id} to the database:\x1b[0m`, error);
            return;
        }
        try {
            const owner = await guild.fetchOwner();
            if (owner) {
                const welcomeMessage = new EmbedBuilder()
                    .setTitle('Welcome to the Server!')
                    .setDescription('Thank you for inviting me to your server.')
                    .addFields(
                        { name: 'You can have all the commands by typing:', value: '/help' }
                    )
                    .setColor('Green')
                    .setTimestamp();
        
                await owner.send({ embeds: [welcomeMessage] });
            } else {
                console.error('\x1b[92m[guildCreate]: Unable to fetch owner of guild\x1b[0m', guild.id);
            }
        } catch (error) {
            console.error('\x1b[92m[guildCreate]: Error sending DM to owner:\x1b[0m', error);
        }
	},
};
