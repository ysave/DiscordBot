const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('A random fun fact'),
    async execute(interaction) {
        //http request
        request('https://uselessfacts.jsph.pl/random.json?language=en', { json: true }, (err, res, body) => {

            if (err) {
                return console.log(err);
            }
            else {
                const e = new MessageEmbed()
                    .setColor('RANDOM')
                    .addField("Fact", `${body.text}`, true)
                    .setFooter(`${body.source_url}`);
                return interaction.reply({ embeds: [e] });
            }
        });
    },
};