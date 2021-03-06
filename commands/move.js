const delay = require('../utils/delay.js');
const { client, prefix } = require('../objs.js');
const replyAndDelete = require('../utils/replyAndDelete.js');
const Command = require('./command.js');
const findChannels = require('../utils/findChannels.js');

const moveAll = new Command({
    name:'moveAll', 
    description: 'Moves all users from channel(s) A...Z to B. Split between channels using the prefix.', 
    /**
     * Moves users from channel(s) from 'from' to 'to'
     * @param {{message, from : Array, to}}
     */
    core: async ({message, from, to}) => {

        if(!to){
            message.reply("Destination not found. Be sure to spell it correctly");
            return false;
        }


        if(!to.permissionsFor(client.user).has(['CONNECT','MOVE_MEMBERS'])){
            replyAndDelete(message, 'I lack the permissions to do that');
            return false;
        }else if(!to.permissionsFor(message.member).has(['CONNECT'])){
            replyAndDelete(message, 'You lack the permission to do that');
            return false;
        }

        for(i = 0; i < from.length; i++){
            for(let [_, member] of from[i].members){
                
                await member.voice.setChannel(to);
                await delay(112);
            }
        }
        return true;
    },

    /**
     * @param {Object} input
     * @returns {{message, from : Array, to}}
     */
    parser : (input) => {

        const bits = input.content.match(/\s.+/)[0].split(prefix).map(xx => xx.trimStart().trimEnd().toLowerCase());
        const destination = bits.splice(-1)[0];

        const from = !bits.length ? [input.member.voice.channel] : findChannels(input.guild, n => n.type == 'voice' && bits.includes(n.name.toLowerCase()));
        const to = findChannels(input.guild, n => n.type == 'voice' && n.name.toString().toLowerCase() == destination)[0];

        return {message : input, from, to};
    }
});

module.exports = moveAll;
