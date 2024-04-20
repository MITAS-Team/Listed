const { SlashCommandBuilder } = require('discord.js');
const Blacklist = require('../../database/schema/Blacklist.model.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Add a user to the blacklist')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to blacklist')
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
            return await interaction.reply({ content: 'You must be an administrator to use this command.', ephemeral: true });
        }

        // Get user and reason from command options
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason'); 

        // Check if the user is already blacklisted
        const blacklistedUser = await Blacklist.findOne({ userID: user.id });
        if (blacklistedUser) {
            return await interaction.reply({
                content: `<@${user.id}> is already in the blacklist.`,
                ephemeral: true
            });
        }

        // Add user to the blacklist
        try {
            const newUser = new Blacklist({
                userID: user.id,
                reason: reason
            });
            await newUser.save();
            await interaction.reply({ content: `<@${user.id}> has been added to the blacklist. Reason: ${reason}`, ephemeral: true });
            await user.kick(reason);
        } catch (error) {
            console.error('Error adding user to blacklist:', error);
            await interaction.reply({ content: 'An error occurred while adding the user to the blacklist.', ephemeral: true });
        }
    },
};
