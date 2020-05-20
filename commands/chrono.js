const Command = require('./command.js');
const { CronJob } = require('cron');
const axios = require('axios');
const findChannels = require('../utils/findChannels.js');
const { client } = require('../objs.js');

/**
 * Retrieves data from the chrono.gg api
 * @async
 * @returns {{normal_price : number, sale_price : number, img, chrono : string, steam : string}}
 */
async function getNewDeal(){
    let res = await axios('http://api.chrono.gg/sale');
    let {normal_price, sale_price, promo_image, unique_url, steam_url} = res.data;
    return {normal_price, sale_price, img : promo_image, chrono : unique_url, steam : steam_url};
}

let chronoDeal;
let chronoChannels;
client.once('ready', () => {chronoChannels = findChannels('all', n => n.type =='text' && n.name == 'chrono'); console.log(chronoChannels);});

const makeEmbed = n => new Object({

    color : 0x0099ff,
    title : 'Chrono Deal',
    url : n.chrono,
    fields : [
        {
            name : 'Normal price',
            value : `$$ n.normal_price}USD`,
        },
        {
            name : 'Sale price',
            value : `$$ n.sale_price}USD`,
        },
        {
            name : 'Chrono link',
            value : n.chrono,
        },
        {
            name : 'Steam link',
            value : n.steam,
            inline : true,
        }
    ],
    image : {url : n.img},
});

const dealReset = new CronJob({

    cronTime : '00 03 12 * * *',
    onTick : async _ => {
        chronoDeal = await getNewDeal();
        //await sendDeal();
    },
    start : true,
    runOnInit : true,
    timeZone : 'US/Eastern'
});

const chrono = new Command({

    name : 'chrono',
    description : 'Returns the chrono.gg dail deal',
    /**
     * @param {Object} message Original message
     * @async
     * Replies to message with data from chronoDeal.
     */
    core : async (message) => {
        const embed = {

            color : 0x0099ff,
            title : 'Chrono Deal',
            url : chronoDeal.chrono,
            fields : [
                {
                    name : 'Normal price',
                    value : `$${chronoDeal.normal_price}USD`,
                },
                {
                    name : 'Sale price',
                    value : `$${chronoDeal.sale_price}USD`,
                },
                {
                    name : 'Chrono link',
                    value : chronoDeal.chrono,
                },
                {
                    name : 'Steam link',
                    value : chronoDeal.steam,
                    inline : true,
                }
            ],
            image : {url : chronoDeal.img},
        };
        message.reply({embed});
        return true;
    },
    parser : (input) => input,

});

module.exports = chrono;