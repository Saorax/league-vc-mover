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
        .setName(`toggle`)
        .setDescription(`enable or disable vc moving..... idk why you would disable this though.......`),
    async execute(interaction) {
        const config2 = JSON.parse(readFileSync(path.join(process.cwd() + "/config.json")));
        if (!config2.admins.includes(interaction.user.id)) return await interaction.reply({
            content: `you don't have permission to use this :nerd:`
        });
        writeFileSync(path.join(process.cwd() + "/config.json"), JSON.stringify({
            game: config2.game,
            admins: config2.admins,
            vc: config2.vc,
            disabled: config2.disabled === true ? false : true
        }))
        await interaction.reply({
            content: `${config2.disabled === false ? "disabled vc moving :wilted_rose: ........" : "enabled vc moving :grin:"}`
        });
    },
};