const getRandomInt = require('../utils/getRandomInt.js');
const replyAndDelete = require('../utils/replyAndDelete.js');
const delay = require('../utils/delay.js');
const Command = require('./command.js');
const {client, banished, immunes, insert, del} = require('../objs.js');

const me = process.env.ME;

/**
 * Shorthand for immunes.has
 * @param {string} id ID that is queried
 * @returns {bool}
 */
function isImmune(id){
    return immunes.has(id);
}

const shuffle = new Command({
    name: 'shuffle', 
    description: 'Shuffles target for X amount of times (max 10)', 
    /**
     * Sets targets voiceChannel for n times where voiceChannel can not be current channel at the time of the call. Returns user to original channel afterwards
     * @async
     * @param {{message , author, target, time : number}}
     */
    core: async ({message, author, target, times}) =>{

        const mesLen = message.content.split` `.length;

        if(mesLen < 3){
            replyAndDelete(message, "Not enough arguments.");
            return;
        }else if(mesLen > 3) {
            replyAndDelete(message, "Too many arguments.");
            return;
        }

        if(times > 10 || times < 1){
            replyAndDelete(message, "Nice try guy, but you can't have a value bigger than 5 or lower than 1");
            return;
        }else if(!author.hasPermission("ADMINISTRATOR")){
            replyAndDelete(message, "Nice try guy.");
            return;
        }

        if(isImmune(target.id)){
            replyAndDelete(message, `Nice try guy, but ${target.displayName} is immune.`);
            return;
        }

        let channels = []; 

        for(field in message.guild.channels.cache){
            console.log(field);
        }
        message.guild.channels.filter(channel => channel.type == 'voice' && channel.permissionsFor(target).has(['CONNECT']) && channel.permissionsFor(client.user).has(['CONNECT','MOVE_MEMBERS'])).forEach(n => channels.push(n));

        let currChannel = target.voiceChannel;

        const len = channels.length;

    for(var i = 0; i < times;){

            let randomNum = getRandomInt(len);

            while(channels[randomNum].id == target.voiceChannel.id || channels[randomNum].id == currChannel.id)
                randomNum = getRandomInt(len);
            

            await target.setVoiceChannel(channels[randomNum]).then(i++);

            await delay(200);

        }

        target.setVoiceChannel(currChannel);

        message.delete(3000);
    },
    /**
     * @param {Object} input Caller's message
     * @returns {{input, author, target, times : number}}
     */
    parser : (input) => {

        let author = input.member;
        let target = input.mentions.members.first();
        let times = input.content.split` `[2];

        return {message : input, author, target ,times};
    }
});

const banish = new Command({
    name: 'banish', 
    description:'Moves user out of channel and into AFK channel for X amount of times. Use unbanish to undo.', 
    core: ({message, author, target, currChannel, times})=>{

        //permcheck AND args check
        if(!author.hasPermission(['ADMINISTRATOR'], false, true, true)|| times < 1 || isImmune(target.id)){
            replyAndDelete(message, "Nice try guy.");
            return;
        }

        if(!banished.has(target)) banished.set(target.id, {times: times, currChannel});
        else return;

        target.setVoiceChannel(null);
    },
    parser : (input) => {

        let author = input.member;
        let target = input.mentions.members.first();
        let currChannel = target.voiceChannel;
        let times = input.content.split` `[2];

        return {message : input, author, target, currChannel, times};
    }
});

const unbanish = new Command({
    name: 'unbanish', 
    description: 'Removes remaining banishes.', 
    /**
     * Removes an ID from the banished TABLE
     * @param {*} target
     */
    core: target => banished.delete(target.id),
    parser : (input) => input.mentions.members.first()
});

const banishSet = {

    banish,

    unbanish,
	
    shuffle,

    makeImmune : new Command({
        name: 'makeImmune', 
        description: 'Makes someone immune towards shuffle and banish.', 
        /**
         * Adds an ID to the immunes TABLE
         * @param {{message, author, target}}
         * @returns
         */
        core:({message, author, target}) => {

            if(author.id != me){

                replyAndDelete(message,"Nice try, but only the author can make others immune.");
                return;
            }

            immunes.add(target.id);

            insert(target.id, "immunes");
            replyAndDelete(message, "Done.");
        },
        parser : (input) => {

            let author = input.member;
            let target = input.mentions.members.first();

            return {message : input, author, target};
        }
    }),

    revoke : new Command({
        name: 'revoke', 
        description: 'Removes the immunity from a user, making them targetable by shuffle and banish.', 
        /**
         * Removes an ID from the immunes TABLE
         * @param {{message, author, target}}
         */
        core: ({message, author, target}) => {
        
            if(author.id != me){
                replyAndDelete("Nice try, but only the author can doom others.");
                return;
            }else if(!isImmune(target.id)){
                replyAndDelete("User is not immune.");
                return;
            }

            immunes.delete(target.id);

            del(target.id, "immunes", "ID");
            replyAndDelete(message, "User is no longer immune.");
        },
        /**
         * @param {Object} input
         * @returns {{input, author, target}}
         */
        parser : (input) => {

            let author = input.member;
            let target = input.mentions.members.first();

            return {message : input, author, target};
        }
    }),
};

module.exports = banishSet;
