const {del, mutes} = require('../objs.js');
const Command  = require('../commands/command.js');

const unstfu = new Command({

    name : 'unstfu',
    description : 'Removes the user from mutes list',
    /**
     * Removes an ID from the stfu TABLE
     * @param {{message : Object, member : Object, id : string}}
     */
    core : ({message, member, id}) =>{

        //Note that the 3 booleans, in order, are: check if user has EXPLICIT permission, allow admin override, allow owner override. Also note that the docs say that EXPLICIT check is deprecated
        if(!member.hasPermission(['ADMINISTRATOR'], false, true, true) && member.id != process.env.ME){
            message.reply('Admin power is required for this command.');
            return false;
        }

        del(id, 'mutes', 'ID');
        mutes.delete(id); 
        return true;
    },
    /**
     * @param {Object} input
     * @returns {{message : Object, member : Object, id : string}}
     */
    parser : (input) => {

        let {member} = input;
        let user = input.mentions.users.first();
        let id = user ? user.id : input.split` `[1];

        return {message : input, member, id};
    } 
});

module.exports = unstfu;