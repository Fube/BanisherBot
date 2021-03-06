const Command = require('../commands/command.js');
const {commBanned, del} = require('../objs.js');

const me = process.env.ME;
const derek = process.env.DEREK;

const uncommban = new Command({

    name : 'unCommBan',
    description : "Let's them back in... sadly",
    /**
     * Removes a user from the blacklist
     * @param {{message : Object, id : string}}
     */
    core : ({message, id}) => {

        if(message.author.id == me || message.author.id == derek){

            message.guild.members.unban(id);

            commBanned.delete(id);
            del(id, "commBanned", "ID");
            return true;
        }
        message.reply(`You aren't the one true master.`);
        return false;

        
    },
    /**
     * @param {Object} input Caller's message
     * @returns {{message : Object, id : string}}
     */
    parser : (input) => {

        const user = input.mentions.members.first();
        const id = user ? user.id : input.content.split` `[1];

        return {message : input, id};
    }
});

module.exports = uncommban;