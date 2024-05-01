const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Blacklist = require('../../database/schema/Blacklist.model.js',),
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
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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
            whitelistedUser = await Whitelist.findOne({ userID: user.id }),
            redlistedUser = await Redlist.findOne({ userID: user.id });

        try {
            switch (listType) {
                /*
                    Blacklist
                */
                case 'blacklist':
                    // Add user to the blacklist
                    try {
                        if (whitelistedUser && whitelistedUser.guilds.find((guild) => guild.ID === interaction.guild.id)) {
                            return await interaction.reply({
                                content: `<@${user.id}> is already in the whitelist and cannot be added to the blacklist.`,
                                ephemeral: true
                            });
                        }

                        if (!blacklistedUser) {
                            const newBlacklistedUser = new Blacklist({
                                userID: user.id,
                                guilds: [{
                                    ID: interaction.guild.id,
                                    reason: reason,
                                    executedBy: interaction.user.id
                                }],
                            });

                            await newBlacklistedUser
                                .save()
                                .then(() => {
                                    interaction.reply({
                                        content: `<@${user.id}> has been added to the blacklist. Reason: ${reason}`,
                                        ephemeral: true
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error adding user to blacklist:', error);
                                    interaction.reply({
                                        content: 'An error occurred while adding the user to the blacklist.',
                                        ephemeral: true
                                    });
                                });

                            return;
                        } else if (blacklistedUser.guilds.find((guild) => guild.ID === interaction.guild.id)) {
                            return await interaction.reply({
                                content: `<@${user.id}> is already in the blacklist.`,
                                ephemeral: true
                            });
                        } else {
                            blacklistedUser.guilds.push({
                                ID: interaction.guild.id,
                                reason: reason,
                                executedBy: interaction.user.id
                            });

                            await blacklistedUser
                                .save()
                                .then(() => {
                                    interaction.reply({
                                        content: `<@${user.id}> has been added to the blacklist. Reason: ${reason}`,
                                        ephemeral: true
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error adding user to blacklist:', error);
                                    interaction.reply({
                                        content: 'An error occurred while adding the user to the blacklist.',
                                        ephemeral: true
                                    });
                                });
                            try {
                                interaction.guild.members.ban(user.id, { reason: reason });
                            } catch (error) {
                                interaction.reply({
                                    content: 'An error occurred while banning the blacklisted user.',
                                    ephemeral: true
                                });
                            }
                            
                            return;
                        }
                    } catch (error) {
                        console.error('Error adding user to blacklist:', error);
                        await interaction.reply({
                            content: 'An error occurred while adding the user to the blacklist.',
                            ephemeral: true
                        });
                        return;
                    }
                    break;

                /*
                    Whitelist
                */
                case 'whitelist':
                    // Add user to the whitelist
                    try {
                        if (blacklistedUser && blacklistedUser.guilds.find((guild) => guild.ID === interaction.guild.id)) {
                            return await interaction.reply({
                                content: `<@${user.id}> is already in the blacklist and cannot be added to the whitelist.`,
                                ephemeral: true
                            });
                        }

                        if (!whitelistedUser) {
                            const newWhitelistedUser = new Whitelist({
                                userID: user.id,
                                guilds: [{
                                    ID: interaction.guild.id,
                                    reason: reason,
                                    executedBy: interaction.user.id
                                }]
                            });

                            await newWhitelistedUser
                                .save()
                                .then(() => {
                                    interaction.reply({
                                        content: `<@${user.id}> has been added to the whitelist. Reason: ${reason}`,
                                        ephemeral: true
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error adding user to whitelist:', error);
                                    interaction.reply({
                                        content: 'An error occurred while adding the user to the whitelist.',
                                        ephemeral: true
                                    });
                                });
                            return;
                        } else if (whitelistedUser.guilds.find((guild) => guild.ID === interaction.guild.id)) {
                            return await interaction.reply({
                                content: `<@${user.id}> is already in the whitelist.`,
                                ephemeral: true
                            });
                        } else {
                            whitelistedUser.guilds.push({
                                ID: interaction.guild.id,
                                reason: reason,
                                executedBy: interaction.user.id
                            });

                            await whitelistedUser
                                .save()
                                .then(() => {
                                    interaction.reply({
                                        content: `<@${user.id}> has been added to the whitelist. Reason: ${reason}`,
                                        ephemeral: true
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error adding user to whitelist:', error);
                                    interaction.reply({
                                        content: 'An error occurred while adding the user to the whitelist.',
                                        ephemeral: true
                                    });
                                });
                            return;
                        }
                    } catch (error) {
                        console.error('Error adding user to whitelist:', error);
                        await interaction.reply({
                            content: 'An error occurred while adding the user to the whitelist.',
                            ephemeral: true
                        });
                        return;
                    }
                    break;
                /*
                    Redlist
                */
                case 'redlist':
                    try {
                        if (!redlistedUser) {
                            const newRedlistedUser = new Redlist({
                                userID: user.id,
                                guilds: [{
                                    ID: interaction.guild.id,
                                    reason: reason,
                                    executedBy: interaction.user.id
                                }],
                            });

                            await newRedlistedUser
                                .save()
                                .then(() => {
                                    interaction.reply({
                                        content: `<@${user.id}> has been added to the redlist. Reason: ${reason}`,
                                        ephemeral: true
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error adding user to redlist:', error);
                                    interaction.reply({
                                        content: 'An error occurred while adding the user to the redlist.',
                                        ephemeral: true
                                    });
                                });

                            return;
                        } else if (redlistedUser.guilds.find((guild) => guild.ID === interaction.guild.id)) {
                            return await interaction.reply({
                                content: `<@${user.id}> is already in the redlist.`,
                                ephemeral: true
                            });
                        } else {
                            redlistedUser.guilds.push({
                                ID: interaction.guild.id,
                                reason: reason,
                                executedBy: interaction.user.id
                            });

                            await redlistedUser
                                .save()
                                .then(() => {
                                    interaction.reply({
                                        content: `<@${user.id}> has been added to the redlist. Reason: ${reason}`,
                                        ephemeral: true
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error adding user to redlist:', error);
                                    interaction.reply({
                                        content: 'An error occurred while adding the user to the redlist.',
                                        ephemeral: true
                                    });
                                });

                            return;
                        }
                    } catch (error) {
                        console.error('Error adding user to redlist:', error);
                        return await interaction.reply({
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
            };
        } catch (error) {
            console.error('Error adding user to list:', error);
            await interaction.reply({
                content: `An error occurred while adding the user to the ${listType}`,
                ephemeral: true
            });
        }
    },
};
