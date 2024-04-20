const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the user.')
                .setRequired(false)),
    async execute(interaction) {
        // Check if the user invoking the command has the necessary permissions
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the user to ban from the interaction options
        const user = interaction.options.getMember('user');
        // Get the reason for banning the user from the interaction options
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Ban the user from the server
            await interaction.guild.members.ban(user, { reason });

            // Send a confirmation message
            await interaction.reply({ content: `Successfully banned ${user.user.tag}.`, ephemeral: true });
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error while banning the user.', ephemeral: true });
        }
    },
};
