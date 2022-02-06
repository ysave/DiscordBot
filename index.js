const { Client, Collection, Intents, MessageActionRow} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');
const { token, guildId, clientId } = require('./config.json');


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.once('ready', async() => {
    console.log("Bot is on!!!");
    client.user.setActivity('Fortnite', { type: 'COMPETING' });
    client.user.setUsername("Tommy Shelby");
});

const rest = new REST({ version: '9' }).setToken(token);
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Reloaded commands');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if(interaction.isButton()){
        if(interaction.customId === "true"){
            interaction.component.setStyle('SUCCESS')
            interaction.component.setDisabled(true)
            await interaction.update({
                components: [
                    new MessageActionRow().addComponents(interaction.component)
                ]
            });
        } else {
            interaction.component.setStyle('DANGER')
            interaction.component.setDisabled(true)
            await interaction.update({
                components: [
                    new MessageActionRow().addComponents(interaction.component)
                ]
            });
        }

    }
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error', ephemeral: true });
    }
});

client.login(token);