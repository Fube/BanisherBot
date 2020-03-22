const delay = require('../utils/delay.js');
const { client, prefix } = require('../objs.js');
const replyAndDelete = require('../utils/replyAndDelete.js');
const Command = require('./command.js');

const moveAll = new Command({
    name:'moveAll', 
    description: 'Moves all users from channel(s) A...Z to B. Split between channels using the prefix.', 
    /**
     * Moves users from channel(s) from 'from' to 'to'
     * @param {{message, from : Array, to}}
     */
    core: async ({message, from, to}) => {

        console.log(`From: ${from}`, to);

        if(!to){
            message.reply("Destination not found. Be sure to spell it correctly");
            return;
        }


        if(!to.permissionsFor(client.user).has(['CONNECT','MOVE_MEMBERS'])){
            replyAndDelete(message, 'I lack the permissions to do that');
            return;
        }else if(!to.permissionsFor(message.member).has(['CONNECT'])){
            replyAndDelete(message, 'You lack the permission to do that');
            return;
        }

        /**Logic starts here*/

        //Since from.members returns a <Snowflake, GuildMember> Colelction, we anticipate it and use the for...of loop to iterate through the collection with ease by ignoring channel and only going after member.

        for(i = 0; i < from.length; i++){
            for(let [_, member] of from[i].members){
                
                //await member.setVoiceChannel(to);
                //await delay(112);
            }
        }
    },

    /**
     * @param {Object} input
     * @returns {{message, from : Array, to}}
     */
    parser : (input) => {

        const bits = input.content.match(/\s.+/)[0].split(prefix).map(xx => xx.trimStart().trimEnd());
        const destination = bits.splice(-1)[0];

        let from = !bits.length ? [input.member.voiceChannel] : bits.map(n => input.guild.channels.find(channel => channel.type =='voice' && channel.name.toString().toLowerCase() == n));
        let to = input.guild.channels.find(channel => channel.type == 'voice' && channel.name.toString().toLowerCase() == destination.toString().toLowerCase());

        return {message : input, from, to};
    }
});

module.exports = moveAll;
