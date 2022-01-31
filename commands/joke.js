const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('wanna hear a funny joke?'),
    async execute(interaction) {
        //http request
        request('https://geek-jokes.sameerkumar.website/api?format=json', { json: true }, (err, res, body) => {

            if (err) {
                return console.log(err);
            }
            else {
                const e = new MessageEmbed()
                    .setColor('RANDOM')
                    .addField("Joke", `${body.joke}`, true);
                return interaction.reply({ embeds: [e] });
            }
        });
    },
};