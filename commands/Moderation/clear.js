const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a specified number of messages from the channel.')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The number of messages to clear.')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Choose a specific user to delete from.')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Check if the user has the 'MANAGE_MESSAGES' permission
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }

        // Get the amount of messages to delete from the interaction options
        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getMember('user');

        // Verify that the amount is within a reasonable range (1-100)
        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'You can only clear between 1 and 100 messages at a time.',
                ephemeral: true
            });
        }

        try {
            let totalDeletedAmount = 0;
            if (user) {
                // loop through all the channels
                for (const [_, channel] of interaction.guild.channels.cache.entries()) {
                    // check if the channel is a text one
                    if (channel.type === 0) {
                        try {
                            // Fetch all the message
                            const messages = await channel.messages.fetch({ limit: amount });
                            // Filter the message to get the one sent by the user
                            const userMessages = messages.filter(msg => msg.author.id === user.id);
                            const deletedAmount = userMessages.size;
                            totalDeletedAmount += deletedAmount;
                            // Delete the message
                            await channel.bulkDelete(userMessages, true);
                        } catch (error) {
                            console.error(error);
                            // Send a message if an error occurred
                            return await interaction.reply({
                                content: `An Error occurred while deleting <@${user.id}> message`,
                                ephemeral: true
                            });
                        }
                    }
                }
            } else {
                // Fetch the messages to delete
                const messages = await interaction.channel.messages.fetch({ limit: amount });

                // Delete the fetched messages
                await interaction.channel.bulkDelete(messages);

                // Update the total deleted amount
                totalDeletedAmount = messages.size;
            }

            if (totalDeletedAmount > 0) {
                await interaction.reply({
                    content: `Successfully deleted ${totalDeletedAmount} messages.`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `No messages found to delete.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error clearing messages:', error);
            await interaction.reply({
                content: 'There was an error while clearing messages.',
                ephemeral: true
            });
        }
    },
};
