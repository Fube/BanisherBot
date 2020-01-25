const Command = require('../commands/command.js');
const {commBanned, insert} = require('../objs.js');

const me = process.env.ME;
const derek = process.env.DEREK;

const commban = new Command({

    name : "commBan",
    description : "Keeps someone banned. Bans on join",
    /**
     * Puts a user on the blacklist given an id OR id-resolvable (e.g. @user)
     * @async
     * @param {{message, id : string}}
     */
    core : async ({message, id}) => {

        if(message.author.id == me || message.author.id == derek){
            message.reply(`You aren't the one true master.`);
            return;
        }

        await message.guild.ban(id);
        
        commBanned.add(id);
        insert(id, "commBanned", "ID");
    },
    /**
     * @param {Object} input
     * @returns {{message, id : string}}
     */
    parser : (input) => {

        let user = input.mentions.members.first();
        let id = user ? user.id : input.split` `[1];

        return {message : input, id};
    }

});

module.exports = commban;