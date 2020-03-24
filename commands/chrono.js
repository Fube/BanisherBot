const Command = require('./command.js');
const { CronJob } = require('cron');
const axios = require('axios');
const { RichEmbed } = require('discord.js');

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
const dealReset = new CronJob({

    cronTime : '00 03 12 * * *',
    onTick : async _ => {
        chronoDeal = await getNewDeal();
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
    },
    parser : (input) => input,

});

module.exports = chrono;