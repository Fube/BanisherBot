const { client } = require('../objs.js');

/**
 * Finds channels that match a predicate
 * @param {*} guild Where to look for the channels
 * @param {function} predicate Criteria to match
 */
const findChannels = (guild, predicate) =>{

    const channels = [];
    let i = 0;
    for(const ch of (guild=='all'?client:guild).channels.cache){

        if(predicate(ch[1], i))
            channels.push(ch[1]);
    }
    return channels;
};

module.exports = findChannels;