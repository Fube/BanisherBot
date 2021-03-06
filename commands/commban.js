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

        if(message.author.id != me && message.author.id != derek){
            message.reply(`You aren't the one true master.`);
            return false;
        }

        await (await message.guild.members.fetch(id)).ban();

        
        
        commBanned.add(id);
        insert(id, "commBanned", "ID");
        return true;
    },
    /**
     * @param {Object} input
     * @returns {{message, id : string}}
     */
    parser : (input) => {

        const user = input.mentions.members.first();
        const id = user ? user.id : input.content.split` `[1];

        return {message : input, id};
    }

});

module.exports = commban;