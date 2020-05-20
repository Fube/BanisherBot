/**
 * Finds messages that match a predicate
 * @param {*} channel Where to look for the messages
 * @param {function} predicate Criteria to match
 */
const findMessages = (channel, predicate) =>{

    const channels = [];
    for(const msg of channel.messages.cache){

        console.log(msg)
        if(predicate(msg[1])){
            channels.push(msg[1]);
        }
    }
    return channels;
};

module.exports = findMessages;