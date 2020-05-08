const Command = require('./command.js');
const delay = require('./delay.js');

const clean = new Command({

    name : 'clean',
    description : 'Removes X messages where 0<x<=500',
    /** 
     * Just discordjs.TextChannel.bulkDelete
     * @param {{channel, times : number}}
    */
    core : async ({channel, times}) =>{

        if(times>500||times<1)return false;
        //This is to avoid the visual bug that sometimes happens when a message is instantly deleted.
        await delay(125);
        await channel.bulkDelete(times+1);
        return {dont:1};
    },
    /**
     * @param {Object} input Caller's message
     * @returns {{channel, times : number}}
     */
    parser : (input) => new Object({channel:input.channel, times:input.content.match(/\d+/)[0]})
});

module.exports = clean;