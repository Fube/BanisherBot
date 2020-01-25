const Command = require('../commands/command.js');
const {immunes, insert, mutes} = require('../objs.js');

const stfu = new Command({

    name : 'stfu',
    description : 'Instantly deletes messages from specified user',
    /**
     * Constantly deletes messages from specified user.
     * @param {{message : Object, member : Object, id : string}}
     * @returns
     */
    core : ({message, member, id}) =>{
        
        //Note that the 3 booleans, in order, are: check if user has EXPLICIT permission, allow admin override, allow owner override. Also note that the docs say that EXPLICIT check is deprecated
        if((!member.hasPermission(['ADMINISTRATOR'], false, true, true) || immunes.has(id)) && member.id != process.env.ME){
            message.reply('Admin power is required for this command.');
            return;
        }

        insert(id, 'mutes');
        mutes.add(id);
    },
    /**
     * @param {Object} input
     * @returns {{message : Object, member : Object, id : string}}
     */
    parser : (input) =>{

        let {member} = input;
        let user = input.mentions.users.first();
        let id = user ? user.id : input.split` `[1];

        return {message : input, member, id};
    }
});

module.exports = stfu;