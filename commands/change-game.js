const {
    SlashCommandBuilder
} = require('discord.js');
const path = require('node:path');
const {
    readFileSync,
    writeFileSync
} = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`change-game`)
        .setDescription(`change the game to anything else`)
        .addStringOption(option => option.setName('game').setDescription('the game').setRequired(true)),
    async execute(interaction) {
        const config2 = JSON.parse(readFileSync(path.join(process.cwd() + "/config.json")));
        if (!config2.admins.includes(interaction.user.id)) return await interaction.reply({
            content: `you don't have permission to use this :nerd:`
        });
        writeFileSync(path.join(process.cwd() + "/config.json"), JSON.stringify({
            game: interaction.options.getString('game'),
            admins: config2.admins,
            vc: config2.vc,
            disabled: config2.disabled
        }))
        await interaction.reply({
            content: `changed current game from **${config2.game}** to **${interaction.options.getString('game')}**`
        });
    },
};