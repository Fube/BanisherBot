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
            return false;
        }

        if(serverMutes.has(target.id)){
            serverMutes.delete(target.id);
            target.voice.setMute(false);
            return true;
        }else{
            return false;
        }
    },
    /**
     * @param {Object} input
     * @returns {{message, target, member, id : string}}
     */
    parser : (input) => {

        const target = input.mentions.members.first();
        const {member} = input;
        const {id} = target;

        return {message : input, target, member, id};
    }

});


module.exports = unmute;