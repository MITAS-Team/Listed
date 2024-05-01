const { Events, EmbedBuilder } = require('discord.js');
const Redlist = require('../database/schema/Redlist.model.js');
const Guilds = require('../database/schema/Guild.model.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
			/*
				Checking if the user is redlisted
				if the user is redlisted, the bot will log the command
				in the log channel of the guild
			*/
            const userID = interaction.user.id;
            const redlistedUser = await Redlist.findOne({ userID: userID });
            if (redlistedUser) {
                const guildSettings = await Guilds.findOne({ ID: interaction.guild.id });
                if (guildSettings && guildSettings.Settings.Logs) {
                    const logChannel = interaction.guild.channels.cache.get(guildSettings.Settings.LogChannel);
                    if (logChannel) {
                        const embed = new EmbedBuilder()
                            .setTitle('Redlisted User Action')
                            .addFields(
                                { name: 'User', value: `<@${userID}>`, inline: true },
                                { name: 'ID', value: userID, inline: true },
                                { name: 'Command', value: `/${interaction.commandName}` },
                                { name: 'Channel', value: `<#${interaction.channel.id}>` }
                            )
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                            .setColor('Red')
                            .setTimestamp();
                        await logChannel.send({ embeds: [embed] });
                    }
                }
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};
