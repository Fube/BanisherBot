const Command = require('./command.js');
const {immunes, serverMutes} = require('../objs.js');

const mute = new Command({ 

    name : "mute",
    description : "Server mute target and instantly remutes them if unmuted",
    /**
     * Adds an ID to the mutes TABLE
     * @param {{message, target, member, id : string}}
     * @returns
     */
    core : ({message, target, member, id}) => {

        if((!member.hasPermission(['ADMINISTRATOR'], false, true, true) || immunes.has(id)) && member.id != process.env.ME){
            message.reply('Admin power is required for this command.');
            return false;
        }

        serverMutes.add(id);
        target.voice.setMute(true);
        return true;
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

module.exports = mute;