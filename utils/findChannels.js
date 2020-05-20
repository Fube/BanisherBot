const { client } = require('../objs.js');

/**
 * Finds channels that match a predicate
 * @param {*} guild Where to look for the channels
 * @param {function} predicate Criteria to match
 */
const findChannels = async (guild, predicate) =>{

    const channels = [];
    console.log(client.channels.cache.size)
    for(const ch of await (guild=='all'?client:guild).channels.cache){

        if(predicate(ch[1])){
            channels.push(ch[1]);
        }
    }
    return channels;
};

module.exports = findChannels;