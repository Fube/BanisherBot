const { banish, unbanish, makeImmune, revoke, shuffle } = require('./commands/banish.js');
const { commBanned, mutes, serverMutes, banished, client, prefix } = require('./objs.js');
const Command = require('./commands/command.js');
const moveAll = require('./commands/move.js');
const rng = require('./utils/rng.js');
const sarc = require('./commands/spongebobify.js');
const commBan = require('./commands/commban.js');
const unCommBan = require('./commands/uncommban.js');
const stfu = require('./commands/stfu.js');
const unstfu = require('./commands/unstfu.js');
const mute = require('./commands/mute.js');
const unmute = require('./commands/unmute.js');
const chrono = require('./commands/chrono.js');
const clean = require('./commands/clean.js');
const replyAndDelete = require('./utils/replyAndDelete.js');

client.on('guildMemberAdd', target => {
    
    if(commBanned.has(target.id)){
        target.ban();
    }
});

client.on('message', message =>{

    const {author} = message;

    if(mutes.has(author.id)){
        message.delete();
    }
});

client.on('voiceStateUpdate', (_old, _new) => {
    if(serverMutes.has(_new.id) && !_new.serverMute){
        _new.setMute(true);
    }
    if(banished.has(_new.id) && banished.get(_new.id) && banished.get(_new.id).times > 1){
        _new.setChannel(null);
        const {times, currChannel} = banished.get(_new.id);
        banished.set(_new.id, {times : times - 1, currChannel : currChannel});
    }else
        comms.unbanish.core(_new);
});


const comms = {

    help : new Command({
        name : 'help',
        description : 'Gives description of a command',
        /**
         * Replies to a message with the description of the specified command and if the command does not exist, it executes notFound
         * @param {{message, name : string}}
         * @returns {void}
         */
        core : ({message, name}) =>{

            if(name.toString().toLowerCase() == 'list'){
                let out = "\n";
                for(let command in comms)
                    out += comms[command] instanceof Command ? `${command}\n` : '';
                message.reply(out);
                return;
            }
            if(comms[name] && comms[name] instanceof Command) 
                message.reply(comms[name].description);
            else 
                comms.notFound(message);
        },
        /**
         * @param {Object} input
         * @returns {{message, name : string}}
         */
        parser : (input) => {

            const name = input.content.split` `[1]; 
            return {message : input, name};
        }
    }),

    /**
     * Replies to message to notify the caller that the specified command was not found.
     * @param {Object} n Message
     */
    notFound : (n, m = 'No such command found') => replyAndDelete(n,m),

    banish,

    unbanish,

    makeImmune,
    
    shuffle,
    
    revoke,

    removeImmunity : revoke,

    moveAll : moveAll,
	
    flip : new Command({
        name: 'flip', 
        description: 'Flips a coin.', 
        /**
         * Takes a message object as an input and repleis to it with Heads or Tails
         * @param {Object} n Message
         */
        core: n => {
            n.reply(rng(0, 1000) % 2 == 0 ? "Heads" : 'Tails');
            return true;
        },
        /**
         * @param {Object} input Doesn't do anything, simply passes message through
         */
        parser : (input) => input
    }),

    rng : new Command({
        name: 'rng', 
        description: 'Generates a number between A and B. If nothing is specified for A, the bot assumes 0.', 
        /**
         * Given at least a number, rng replies to the original message with a random number in range of min and max. Min is optional.
         * @param {{message, min? : number, max : number}}
         */
        core: ({message, min = 0, max}) => {
            const num = rng(min, max);
            if(num || num === 0){
                message.reply(num);
                return true;
            }
            return false;
        },
        /**
         * @param {Object} input Caller's message
         * @returns {{input, min? : number, max : number}}
         */
        parser : (input) => {

            const bits = input.content.split` `;
            return bits.length == 3 ? 
            {message : input, min : Number(bits[1]), max : Number(bits[2])} : 
            {message : input, max : Number(bits[1])};
        }
    }),

    commBan,

    unCommBan,

    stfu,

    unstfu,

    mute,

    unmute,

    sarc,

    chrono,

    clean,
};


client.on('message', async function(message){
	
	if(message.content[0] === prefix){

        const name = message.content.split` `[0].slice(1).toLowerCase();
        let command;

        for(let i in comms){
            if(i.toString().toLowerCase() == name){
                command = comms[i];
                break;
            }
        }
        
        if(command && command instanceof Command){
            let valid;
            try{
                valid = await command.core(command.parser(message));
            }catch(e){
                valid = false;
                console.log(e.stack);
            }
            if(!valid.dont)message.react(valid ? '✅' : '❌');
        }else
            comms.notFound(message);
	}
});

process.on('unhandledRejection', console.error);

client.once('ready', _ => console.log('Mounted and loaded'));

client.login(process.env.BOT_TOKEN);
