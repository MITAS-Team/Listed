const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(seconds % (3600 * 24) / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const formattedUptime = `${days}d ${hours}h ${minutes}m`;
    return formattedUptime;
}

function getLatencyColor(latency) {
    if (latency < 100) {
        return '#3FA05B';
    } else if (latency < 200) {
        return '#F8A419';
    } else {
        return '#EA4041'; 
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        // Calculate latency
        const latency = Date.now() - interaction.createdTimestamp;
        const latencyColor = getLatencyColor(latency);

        const pingEmbed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor(latencyColor)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true,
                })
            })
            .addFields(
                { name: 'Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
                { name: 'Uptime', value: formatUptime(interaction.client.uptime / 1000) }
            )
            .setThumbnail('https://media1.tenor.com/m/mJeIh9DoBFwAAAAd/ping-conection.gif');

        await interaction.reply({ embeds: [pingEmbed] });
    },
};
