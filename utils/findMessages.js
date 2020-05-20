/**
 * Finds messages that match a predicate
 * @param {*} channel Where to look for the messages
 * @param {function} predicate Criteria to match
 */
const findMessages = (channel, predicate) =>{

    const messages = [];
    console.log(channel.messages.cache.size)
    for(const msg of channel.messages.cache){

        console.log(msg)
        if(predicate(msg[1])){
            messages.push(msg[1]);
        }
    }
    return messages;
};

module.exports = findMessages;