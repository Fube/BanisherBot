const _Client = require('discord.js').Client;
const client = new _Client();
const { Client } = require('pg');
const HashMap = require('hashmap');

const immunes = new Set();
//For COMMBAN
const commBanned = new Set();
//For STFU
const mutes = new Set();
//For MUTE
const serverMutes = new Set();
//For BANISH
const banished = new HashMap();

/**
 * Inserts a value into the database
 * @param {string} id ID that is to be added to the database
 * @param {string} where TABLE where the ID is to be added
 */
function insert(id, where){
    db.query(`INSERT INTO "${where}" VALUES (${id.toString()})`);
}

/**
 * Deletes a value from the database
 * @param {string} id ID that is to be removed
 * @param {string} where TABLE where the ID is to be removed from
 * @param {string} field FIELD within the TABLE
 */
function deleteValue(id, where, field){
    db.query(`DELETE FROM "${where}" WHERE "${field}"='${id.toString()}'`);
}



const db = new Client({

    connectionString: process.env.DATABASE_URL,
    ssl : true,
});

db.connect();

/**
 * Fills a set with a TABLE's data
 * @param {Set<string>} set Set to fill with TABLE's data
 * @param {string} table TABLE name
 * @returns {Promise<Set<string>>}
 */
function setAsResolvable(set, table){

    let promise = new Promise(resolve => db.query(`SELECT * FROM "${table.toString()}";`), (err, res) => {

        for(let row of res.rows){
            set.add(row.ID);
        }

        resolve(set);
    });

    return promise;
}

let readCommBanned = setAsResolvable(commBanned, 'commBanned');
let readImmunes = setAsResolvable(immunes, 'immunes');
let readMutes = setAsResolvable(mutes, 'mutes');

const objs = {

    client,

    db,

    insert,

    del : deleteValue,

    immunesIsDone : readImmunes,

    commBannedIsDone : readCommBanned,

    mutesIsDone : readMutes,

    immunes,

    commBanned,

    mutes,

    serverMutes,

    banished,

    prefix : '%',

};

module.exports = objs;
