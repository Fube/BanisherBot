const Command = require('./command.js');
const {serverMutes, immunes} = require('../objs.js');


const unmute = new Command({

    name : 'unmute',
    description : 'Removes user from the server mute list',
    /**
     * Removes an ID from the mutes TABLE
     * @param {{message, target, member, id : string}}
     * @returns
     */
    core : ({message, target, member, id}) => {

        if((!member.hasPermission(['ADMINISTRATOR'], false, true, true) || immunes.has(id)) && member.id != process.env.ME){
            message.reply('Admin power is required for this command.');
            return;
        }

        if(serverMutes.has(target.id)){
            serverMutes.delete(target.id);
            target.setMute(false);
            message.reply('Successfuly unmuted target');
            return;
        }else{
            message.reply('Command was not exectued successfuly');
            return;
        }
    },
    /**
     * @param {Object} input
     * @returns {{message, target, member, id : string}}
     */
    parser : (input) => {

        let target = input.mentions.members.first();
        let {member} = input;
        let {id} = target;

        return {message : input, target, member, id};
    }

});


module.exports = unmute;