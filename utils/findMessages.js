/**
 * Finds messages that match a predicate
 * @param {*} channel Where to look for the messages
 * @param {function} predicate Criteria to match
 */
const findMessages = async (channel, predicate) =>{

    const messages = [];
    await channel.messages.fetch();
    
    for(const msg of channel.messages.cache){

        if(predicate(msg[1]))
            messages.push(msg[1]);
    }
    return messages;
};

module.exports = findMessages;