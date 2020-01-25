/**
 * Replies to a message and deletes message and reply after a given time
 * @param {Object} message Message to reply to
 * @param {string} reply Reply to the message
 * @param {number} [time=3000] Time in ms
 */
const replyAndDelete = (message, reply, time = 3000) => message.reply(reply).then(n => {n.delete(time); message.delete(time);});

module.exports = replyAndDelete;