const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user.')
                .setRequired(false)),
    async execute(interaction) {
        // Check if the user invoking the command has the necessary permissions
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ 
                content: 'You do not have permission to use this command.', 
                ephemeral: true 
            });
        }

        // Get the user to kick from the interaction options
        const user = interaction.options.getMember('user');
        // Get the reason for kicking the user from the interaction options
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Kick the user from the server
            await user.kick(reason);

            // Send a confirmation message
            await interaction.reply({ 
                content: `Successfully kicked ${user.user.tag}.`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply({ content: 'There was an error while kicking the user.', ephemeral: true });
        }
    },
};
