import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetScores, log, logfor, SetScores } from '../lib/GameLibrary.js';
import { getData, setData } from '../lib/JsonTagDB';
import { DefMaxXp, specialLevelMappings, levelUpMsg } from "../lib/LevelDefine.js";


import { WorldDB } from "../lib/WorldDB.js";
export const ExpDB = new WorldDB("xp");
export const LevelDB = new WorldDB("level");

export function LevelSystem(player){
    level = LevelDB.getRawData(player);
    exp = ExpDB.getRawData(player);

    if (level == null) { level = "0" };

    let fm = new ui.ActionFormData();

    fm.title(`等級系統`);
    fm.body(`您目前為§aLv.${level}§r\n\n等級獎勵:`);
    
    fm.button(`查看等級排名`,);

    fm.show(player).then(response => {
        if (!response) return;
    });
}

export function addXp(player,exp) {
    // const exp = Math.round(Math.random() * baseXP);
    let player_level = LevelDB.getRawData(player);
    const player_exp = ExpDB.getRawData(player);

    if (player_level == null) {
        player_level = 0;
        LevelDB.setRawData(player, 0);
    }

    ExpDB.addRawData(player, exp)

    if (player_exp >= DefMaxXp(player_level)) {
        ExpDB.setRawData(player, 0);
        LevelDB.addRawData(player, 1);
        let specialText = "";
        let text = `${levelUpMsg.replace(/%level%+/, String(player_level))}`;
        if (specialLevelMappings[++player_level] && specialLevelMappings[player_level].text !== "") {
            if (`${specialLevelMappings[player_level].text}`.match(/^%/)) {
                logfor(player, `${specialLevelMappings[player_level].text}`);
            } else {
                logfor(player, `${text}\n${specialLevelMappings[player_level].text}`);
            }
            if (specialLevelMappings[player_level].handler !== []) {
                player.addTag("plugin.target");
                cmds(specialLevelMappings[player_level].handler)
                player.removeTag("plugin.target");
            }
        } else {
            logfor(player, `${text}`);
        }
    }
}