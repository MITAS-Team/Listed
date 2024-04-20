const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const msg = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = msg.createdTimestamp - interaction.createdTimestamp;
        const uptime = process.uptime();

        const formatUptime = seconds => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secondsLeft = Math.floor(seconds % 60);

            return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
        };

        await interaction.editReply({
            content: `🏓 **Pong!**\nLatency: ${latency}ms\nUptime: ${formatUptime(uptime)}`
        });
    },
};
