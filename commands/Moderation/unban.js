const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user to unban (provide user ID).')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user invoking the command has the necessary permissions
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the user ID to unban from the interaction options
        const userId = interaction.options.getString('user');

        try {
            // Unban the user from the server
            await interaction.guild.bans.remove(userId);

            // Send a confirmation message
            await interaction.reply({ content: `Successfully unbanned user with ID ${userId}.`, ephemeral: true });
        } catch (error) {
            console.error('Error unbanning user:', error);
            await interaction.reply({ content: 'There was an error while unbanning the user.', ephemeral: true });
        }
    },
};
