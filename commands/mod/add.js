const { SlashCommandBuilder } = require('discord.js');
const Blacklist = require('../../database/schema/Blacklist.model.js'),
    Whitelist = require('../../database/schema/Whitelist.model.js'),
    Redlist = require('../../database/schema/Redlist.model.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a user to the choosen list')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to add to the list')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('list')
                .setDescription('The type of list to add the user')
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
        const user = interaction.options.getMember('user'),
            reason = interaction.options.getString('reason'),
            listType = interaction.options.getString('list');

        const blacklistedUser = await Blacklist.findOne({ userID: user.id }),
            whitelistedUser = await Whitelist.findOne({ 'user.ID': user.id }),
            redlistedUser = await Redlist.findOne({ userID: user.id });

        switch (listType) {
            /*
                Blacklist
            */
            case 'blacklist':
                // Add user to the blacklist
                try {
                    // Check if the user is already blacklisted
                    if (blacklistedUser) {
                        return await interaction.reply({
                            content: `<@${user.id}> is already in the blacklist.`,
                            ephemeral: true
                        });
                    };

                    if (whitelistedUser) {
                        return await interaction.reply({
                            content: `<@${user.id}> is in the whitelist and cannot be blacklisted.`,
                            ephemeral: true
                        });
                    };

                    // Create a new user in the blacklist
                    const newUser = new Blacklist({
                        executedBy: {
                            ID: interaction.user.id,
                            Tag: interaction.user.tag
                        },
                        user: {
                            ID: user.id,
                            Tag: user.user.tag

                        },
                        reason: reason
                    });
                    await newUser.save();
                    await interaction.reply({
                        content: `<@${user.id}> has been added to the blacklist. Reason: ${reason}`,
                        ephemeral: true
                    });

                    // Send the user the reason why he was blacklisted
                    await user.send({
                        content: `You have been blacklisted from ${interaction.guild.name}.\nReason: ${reason}`,
                        files: ["src/nuhuh.gif"]
                    });

                    // Ban the blacklisted user
                    await interaction.guild.members.ban(user, { reason: reason });
                } catch (error) {
                    console.error('Error adding user to blacklist:', error);
                    await interaction.reply({
                        content: 'An error occurred while adding the user to the blacklist.',
                        ephemeral: true
                    });
                }
                break;

            /*
                Whitelist
            */
            case 'whitelist':
                // Add user to the whitelist
                try {
                    // Check if the user is already whitelisted
                    if (whitelistedUser) {
                        return await interaction.reply({
                            content: `<@${user.id}> is already in the whitelist.`,
                            ephemeral: true
                        });
                    };

                    if (blacklistedUser) {
                        return await interaction.reply({
                            content: `<@${user.id}> is already in the blacklist.`,
                            ephemeral: true
                        });
                    }

                    // Create a new user in the whitelist
                    const newUser = new Whitelist({
                        executedBy: {
                            ID: interaction.user.id,
                            Tag: interaction.user.tag
                        },
                        user: {
                            ID: user.id,
                            Tag: user.user.tag

                        },
                        reason: reason
                    });

                    await newUser.save();
                    await interaction.reply({
                        content: `<@${user.id}> has been added to the whitelist. Reason: ${reason}`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Error adding user to whitelist:', error);
                    return await interaction.reply({
                        content: 'An error occurred while adding the user to the whitelist.',
                        ephemeral: true
                    });
                }
                break;
            /*
                Redlist
            */
            case 'redlist':
                // Add user to the redlist
                try {
                    // Check if the user is already redlisted
                    if (redlistedUser) {
                        return await interaction.reply({
                            content: `<@${user.id}> is already in the redlist.`,
                            ephemeral: true
                        });
                    }

                    // Create a new user in the redlist
                    const newUser = new Redlist({
                        executedBy: {
                            ID: interaction.user.id,
                            Tag: interaction.user.tag

                        },
                        user: {
                            ID: user.id,
                            Tag: user.user.tag
                        },
                        reason: reason
                    });
                    await newUser.save();
                    await interaction.reply({
                        content: `<@${user.id}> has been added to the redlist. Reason: ${reason}`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Error adding user to redlist:', error);
                    await interaction.reply({
                        content: 'An error occurred while adding the user to the redlist.',
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
