const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Blacklist = require('../../database/schema/Blacklist.model.js'),
    Whitelist = require('../../database/schema/Whitelist.model.js'),
    Redlist = require('../../database/schema/Redlist.model.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription('Get the data of a user in a specific list')
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('The user-id')
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
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.reply({
                content: 'You must be an administrator to use this command.',
                ephemeral: true
            });
        }

        // Get user and reason from command options
        const user = interaction.options.getString('user'),
            listType = interaction.options.getString('list');

        const blacklistedUser = await Blacklist.findOne({ 'user.ID': user }),
            whitelistedUser = await Whitelist.findOne({ 'user.ID': user }),
            redlistedUser = await Redlist.findOne({ 'user.ID': user })

        let listModel,
            colors,
            listName;
        switch (listType) {
            /*
                Blacklist
            */
            case 'blacklist':
                if (!blacklistedUser) {
                    return await interaction.reply({
                        content: `<@${user}> is not found in the Database`,
                        ephemeral: true
                    })
                }
                listModel = Blacklist;
                listName = "Blacklist";
                colors = "Black";
                break;

            /*
                Whitelist
            */
            case 'whitelist':
                if (!whitelistedUser) {
                    return  await interaction.reply({
                        content: `<@${user}> is not found in the Database`,
                        ephemeral: true
                    })
                }
                listModel = Whitelist;
                listName = "Whitelist"
                colors = "White";
                break;
            /*
                Redlist
            */
            case 'redlist':
                if (!redlistedUser) {
                    return await interaction.reply({
                        content: `<@${user}> is not found in the Database`,
                        ephemeral: true
                    })
                }
                listModel = Redlist;
                listName = "Redlist"
                colors = "Red";
                break;
            default:
                return await interaction.reply({
                    content: 'Invalid list type.',
                    ephemeral: true
                });
                break;
        };

        try {
            const userData = await listModel.findOne({ 'user.ID': user });
            if (!userData) {
                return await interaction.reply({
                    content: 'User not found in the specified list.',
                    ephemeral: true
                });
            }

            const getEmbed = new EmbedBuilder()
            .setColor(colors)
            .setTitle(`User information for ${listName}`)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                })
            })
            .addFields(
                {
                    name: "Username",
                    value: userData.user.Tag,
                    inline: true
                },
                {
                    name: "User ID",
                    value: userData.user.ID,
                    inline: true
                },
            )
            .addFields(
                {
                    name: "Reason",
                    value: userData.reason,
                    inline: true
                },
                {
                    name: "Timestamp",
                    value: userData.Timestamp.toLocaleString('fr-FR'),
                    inline: true
                }
            )
            .setTimestamp()

            await interaction.reply({
                embeds: [getEmbed],
                ephemeral: true
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            await interaction.reply({
                content: 'An error occurred while fetching user data.',
                ephemeral: true
            });
        }
    },
};
