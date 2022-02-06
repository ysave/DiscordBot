const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow} = require('discord.js');
const request = require('request');

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('A game to get better general knowledge'),
    async execute(interaction) {
        //http request
        request('https://opentdb.com/api.php?amount=1&type=multiple', { json: true }, async (err, res, body) => {

            if (err) {
                return console.log(err);
            } else {
                const e = new MessageEmbed()
                    .setColor('RANDOM')
                    .addField(`${body.results[0].question}`, `${body.results[0].difficulty}`, true)
                const row = new MessageActionRow()
                    .addComponents(
                            new MessageButton()
                                .setCustomId('true')
                                .setLabel(`${body.results[0].correct_answer}`)
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('false')
                                .setLabel(`${body.results[0].incorrect_answers[0]}`)
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('false2')
                                .setLabel(`${body.results[0].incorrect_answers[1]}`)
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('false3')
                                .setLabel(`${body.results[0].incorrect_answers[2]}`)
                                .setStyle('SECONDARY')
                    )
                shuffle(row.components)
                await interaction.reply({embeds: [e], components: [row]});
            }
        });
    }
};