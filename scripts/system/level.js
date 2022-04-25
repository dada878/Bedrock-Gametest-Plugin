import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetScores, log, logfor, SetScores } from '../lib/GameLibrary.js';
import { getData, setData } from '../lib/JsonTagDB';

import { WorldDB } from "../lib/WorldDB.js";
var expdb = new WorldDB("exp_database");
var leveldb = new WorldDB("level_database");

export function LevelSystem(player){
    level = leveldb.getNotbaseData(player);
    exp = expdb.getNotbaseData(player);

    if (level == null) { level = "0" };

    let fm = new ui.ActionFormData();

    fm.title(`等級系統`);
    fm.body(`您目前為§aLv.${level}§r\n\n等級獎勵:`);
    
    fm.button(`查看等級排名`,);

    fm.show(player).then(response => {
        if (!response) return;
    });
}

export{ expdb };
export{ leveldb };