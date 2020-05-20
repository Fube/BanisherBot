/**
 * Finds messages that match a predicate
 * @param {*} channel Where to look for the messages
 * @param {function} predicate Criteria to match
 */
const findMessages = async (channel, predicate) =>{

    const messages = [];
    
    for(const msg of await channel.messages.fetch()){

        if(predicate(msg[1])){
            messages.push(msg[1]);
        }
    }
    return messages;
};

module.exports = findMessages;