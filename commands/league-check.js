const {
    SlashCommandBuilder
} = require('discord.js');
const path = require('node:path');
const {
    EmbedBuilder
} = require('discord.js');
const { readFileSync } = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`game-list`)
        .setDescription(`check who is playing THE game...........`),
    async execute(interaction) {
        const config = JSON.parse(readFileSync(path.join(process.cwd() + "/config.json")));
        let act = [];
        let chans = await interaction.guild.members.cache.filter(member =>
            member.presence !== null &&
            member.presence.activities.length !== 0 &&
            member.presence.activities.filter(user => user.name.toLocaleLowerCase() == config.game)[0] !== undefined
        ).toJSON();
        console.log(config)
        if (chans.length === 0) return await interaction.reply({
            content: `## there are 0 people playing ${config.game.toLocaleLowerCase()} yippee! :grin:`,
		});
        for (var i = 0; i < chans.length; i++) {
            let leagueFilter = chans[i].presence.activities.filter(user => user.name.toLocaleLowerCase() == config.game)[0];
            act.push({
                name: `${chans[i].user.globalName} (${chans[i].user.id})`,
                value: `${leagueFilter.state !== null ? `**${leagueFilter.state}**\n` : ""}<t:${Math.floor(leagueFilter.createdTimestamp / 1000)}:R>`
            })
        };
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .addFields(act)
            .setTimestamp();
		await interaction.reply({
            content: `## there are currently **${chans.length}** ${config.game.toLocaleLowerCase()} players in this server`,
            embeds: [exampleEmbed]
		});
    },
};