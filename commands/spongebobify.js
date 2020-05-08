const rng = require('../utils/rng.js');
const Command = require('../commands/command.js');

const sbify = new Command({

    name : 'sarc',
    description : 'Spongebob-ifies a string',
    /**
     * Spongebob-ifies a string, deletes original message, and sends it to original message's channel
     * @param {{message, text : string}}
     */
    core: ({message, text}) => {

        let out = '';
        for(let i of text) out += rng(1, 100) > 60 ? i.toUpperCase() : i.toLowerCase();

        message.channel.send(`From ${message.author.username}, ${out}`);
        message.delete();
        return true;
    },
    /**
     * @param {Object} input
     * @returns {{message, text : string}}
     */
    parser : (input) => {

        return {message : input, text : input.content.split` `.slice(1).join` `};
    }
});

module.exports = sbify;