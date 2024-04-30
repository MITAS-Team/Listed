const { SlashCommandBuilder } = require('discord.js');
const Blacklist = require('../../database/schema/Blacklist.model.js'),
    Whitelist = require('../../database/schema/Whitelist.model.js'),
    Redlist = require('../../database/schema/Redlist.model.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a user from the choosen list')
        .addStringOption(option =>
            option
                .setName('user-id')
                .setDescription('The user to remove (provide user ID).')
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
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for blacklisting')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Check if the user executing the command is an administrator
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.reply({
                content: 'You must be an administrator to use this command.',
                ephemeral: true
            });
        }

        // Get user and reason from command options
        const user = interaction.options.getString('user-id'),
            reason = interaction.options.getString('reason'),
            listType = interaction.options.getString('list');

        const blacklistedUser = await Blacklist.findOne({ 'user.ID': user }),
            whitelistedUser = await Whitelist.findOne({ 'user.ID': user }),
            redlistedUser = await Redlist.findOne({ 'user.ID': user });


        switch (listType) {
            /*
                Blacklist
            */
            case 'blacklist':
                // Remove user from the blacklist
                try {
                    if (!blacklistedUser) {
                        await interaction.reply({
                            content: `The user you provided is not in the blacklist`,
                            ephemeral: true
                        });
                    } else {
                        await Blacklist.findOneAndDelete({
                            'user.ID': user
                        });

                        await interaction.reply({
                            content: `<@${user}> is removed from the blacklist`,
                            files: ['src/yuhuh.gif'],
                            ephemeral: true
                        });

                        await interaction.guild.bans.remove(user);
                    }
                } catch (error) {
                    console.error('Error removing user from blacklist:', error);
                    await interaction.reply({
                        content: 'An error occurred while removing the user from the blacklist.',
                        ephemeral: true
                    });
                }
                break;

            /*
                Whitelist
            */
            case 'whitelist':
                try {
                    if (!whitelistedUser) {
                        await interaction.reply({
                            content: `The user you provided is not in the whitelist`,
                            ephemeral: true
                        });
                    } else {
                        await Whitelist.findOneAndDelete({
                            'user.ID': user
                        });
                        
                        await interaction.reply({
                            content: `<@${user}> is removed from the whitelist`,
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    console.error('Error removing user from whitelist:', error)
                    await interaction.reply({
                        content: 'An error occurred while removing the user from the whitelist',
                        ephemeral: true
                    });
                }
                break;
            /*
                Redlist
            */
            case 'redlist':
                try {
                    if (!redlistedUser) {
                        await interaction.reply({
                            content: `The user you provided is not in the redlist`,
                            ephemeral: true
                        });
                    } else {
                        await Redlist.findOneAndDelete({
                            'user.ID': user
                        });
                        
                        await interaction.reply({
                            content: `<@${user}> is removed from the redlist`,
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    console.error('Error removing user from redlist:', error)
                    await interaction.reply({
                        content: 'An error occurred while removing the user from the redlist',
                        ephemeral: true
                    });
                }
                break;
            default:
                return await interaction.reply({
                    content: 'Invalid list type.',
                    ephemeral: true
                });
                break;
        };
    },
};