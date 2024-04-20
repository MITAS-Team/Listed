const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a specified number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to clear.')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user has the 'MANAGE_MESSAGES' permission
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the amount of messages to delete from the interaction options
        const amount = interaction.options.getInteger('amount');
        
        // Verify that the amount is within a reasonable range (1-100)
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You can only clear between 1 and 100 messages at a time.', ephemeral: true });
        }

        try {
            // Fetch the messages to delete
            const messages = await interaction.channel.messages.fetch({ limit: amount });

            // Delete the fetched messages
            await interaction.channel.bulkDelete(messages);

            // Send a confirmation message
            await interaction.reply({ content: `Successfully cleared ${amount} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error clearing messages:', error);
            await interaction.reply({ content: 'There was an error while clearing messages.', ephemeral: true });
        }
    },
};
