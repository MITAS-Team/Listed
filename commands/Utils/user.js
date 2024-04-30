const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provide information about the user'),
    async execute(interaction) {
        const user = interaction.member;
        const roles = user.roles.cache.map(role => role.name).join(', ');

        await interaction.reply(`ℹ️ **User Information:**\n` +
            `• Username: ${user.user.username}\n` +
            `• ID: ${user.id}\n` +
            `• Joined on: ${user.joinedAt}\n` +
            `• Roles: ${roles}`);
    },
};
