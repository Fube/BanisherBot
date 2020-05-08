const Command = require('./command.js');

const clean = new Command({

    name : 'clean',
    description : 'Removes X messages where 0<x<=500',
    /** 
     * Just discordjs.TextChannel.bulkDelete
     * @param {{channel, times : number}}
    */
    core : async ({channel, times}) =>{

        console.log(times, channel)
        if(times>500||times<1)return false;
        await channel.bulkDelete(times);
        return true;
    },
    /**
     * @param {Object} input Caller's message
     * @returns {{channel, times : number}}
     */
    parser : (input) => new Object({channel:input.channel, times:input.content.match(/\d+/)})
});

module.exports = clean;