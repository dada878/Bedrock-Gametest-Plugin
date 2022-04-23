import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js';

export function getData(player,key) {
    let db = checkDB(player);
    if (db["tagDB"][key] == undefined) db["tagDB"][key] = null;
    return db["tagDB"][key];
}

export function setData(player,key,value) {
    let db = checkDB(player);
    player.removeTag(JSON.stringify(db));
    db["tagDB"][key] = value;
    player.addTag(JSON.stringify(db));
}

function checkDB(player) {
    const tags = player.getTags();

    let found = false;
    let DB;

    for (let i in tags) {
        if (tags[i].startsWith('{"tagDB":{')) {
            DB = JSON.parse(tags[i]);
            found = true;
        }
    }

    if (found) return DB;

    DB = {"tagDB":{}};
    player.addTag(JSON.stringify(DB));

    return DB;
}