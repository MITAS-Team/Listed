const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../database/schema/Guild.model.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Add a user to the choosen list')
        .addBooleanOption(option => 
            option
                .setName('enable')
                .setDescription('Enable or disable the logs')
                .setRequired(true)
        )
        .addChannelOption(option => 
            option
                .setName('channel')
                .setDescription('The channel to log the commands')
        ),
    async execute(interaction) {
        const guildSettings = await Guild.findOne({ ID: interaction.guild.id });
        const logChannel = interaction.options.getChannel('channel');
        const enable = interaction.options.getBoolean('enable');

        if (enable) {
            if (!logChannel) return interaction.reply({ content: 'Please provide a channel', ephemeral: true });

            guildSettings.Settings.Logs = true;
            guildSettings.Settings.LogChannel = logChannel.id;
            
            await guildSettings.save();
            return interaction.reply({ content: 'Logs enabled', ephemeral: true });
        } else {
            guildSettings.Settings.Logs = false;
            guildSettings.Settings.LogChannel = 'Null';
            await guildSettings.save();
            return interaction.reply({ content: 'Logs disabled', ephemeral: true });
        }
    },
};
