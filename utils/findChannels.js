const { client } = require('../objs.js');

/**
 * Finds channels that match a predicate
 * @param {*} guild Where to look for the channels
 * @param {function} predicate Criteria to match
 */
const findChannels = (guild, predicate) =>{

    const channels = [];
    console.log(client.channels)
    for(const ch of guild=='all'?client.channels.cache:guild.channels.cache){

        console.log(ch)

        if(predicate(ch[1])){
            channels.push(ch[1]);
        }
    }
    return channels;
};

module.exports = findChannels;