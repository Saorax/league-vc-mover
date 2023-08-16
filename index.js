require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { readFileSync } = require('fs');
const {
    REST,
    Routes,
    Client,
    Collection,
    Events,
    GatewayIntentBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

client.commands = new Collection();
const commands = [];
const foldersPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
};
const rest = new REST().setToken(process.env.token);
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.client, process.env.guild), {
                body: commands
            },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        client.login(process.env.token);
    } catch (error) {
        console.error(error);
    }
})();
client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
    //interaction.guild.members.cache.filter(member => member.voice.channel).filter(user => user.voice.setChannel).toJSON()[0];
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    }
});

setInterval(async function () {
    const config = JSON.parse(readFileSync(path.join(process.cwd() + "/config.json")));
    if (config.disabled === true) return;
    let list = await client.guilds.fetch(process.env.guild).then(res => res.members.cache.filter(member =>
        member.voice.channel &&
        member.presence !== null &&
        member.presence.activities.length !== 0 &&
        member.presence.activities.filter(user => user.name.toLocaleLowerCase() == config.game)[0] !== undefined
    ).toJSON())
    for (var i = 0; i < list.length; i++) {
        if (list[i].voice.channelId != config.vc) list[i].voice.setChannel(config.vc);
    };
}, 10000);