const Command = require('./command.js')
const { insert } = require('../objs.js');


const bindChrono = new Command({

    name: 'bindChrono',
    description: 'Makes channel receive chrono.gg updates',
    /** 
     * Self explanatory...
     * 
     * @param {string} n id of channel to add
     * @returns {boolean}
     */
    core: (n) => {insert(n.channel.id, 'chrono'); return true;},
    parser: (n) => n

});

module.exports = bindChrono;