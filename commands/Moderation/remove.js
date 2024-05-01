const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Blacklist = require('../../database/schema/Blacklist.model.js'),
    Whitelist = require('../../database/schema/Whitelist.model.js'),
    Redlist = require('../../database/schema/Redlist.model.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a user from the chosen list in the current guild')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to remove from the list')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('list')
                .setDescription('The type of list to remove the user from')
                .setChoices(
                    { name: 'Blacklist', value: 'blacklist' },
                    { name: 'Whitelist', value: 'whitelist' },
                    { name: 'Redlist', value: 'redlist' },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        // Check if the user executing the command is an administrator
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: 'You must be an administrator to use this command.',
                ephemeral: true
            });
        }

        // Get user and list type from command options
        const user = interaction.options.getMember('user'),
            listType = interaction.options.getString('list');

        try {
            let model;
            switch (listType) {
                case 'blacklist':
                    model = Blacklist;
                    break;
                case 'whitelist':
                    model = Whitelist;
                    break;
                case 'redlist':
                    model = Redlist;
                    break;
                default:
                    return await interaction.reply({
                        content: 'Invalid list type.',
                        ephemeral: true
                    });
            }

            // Find the user in the corresponding list
            const userDocument = await model.findOne({ userID: user.id });
            if (!userDocument) {
                return await interaction.reply({
                    content: `<@${user.id}> is not in the ${listType}.`,
                    ephemeral: true
                });
            }

            // Remove the current guild's ID from the user's guilds array
            const guildIndex = userDocument.guilds.findIndex(guild => guild.ID === interaction.guild.id);
            if (guildIndex !== -1) {
                userDocument.guilds.splice(guildIndex, 1);
            }
            
            // If there are no more guilds associated with the user, completely remove the user from the database
            if (userDocument.guilds.length === 0) {
                await model.findOneAndDelete({ userID: user.id });
            } else {
                // Save the updated user document back to the database
                await userDocument.save();
            }

            return await interaction.reply({
                content: `<@${user.id}> has been removed from the ${listType} in this guild.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error removing user from list:', error);
            return await interaction.reply({
                content: `An error occurred while removing the user from the ${listType}.`,
                ephemeral: true
            });
        }
    },
};
