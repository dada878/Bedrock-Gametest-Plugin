import * as Minecraft from 'mojang-minecraft';
import * as ui from 'mojang-minecraft-ui';
import { cmd,cmds, executeCmds, GetScores, log, logfor, SetScores } from '../lib/GameLibrary.js';
import { DefMaxXp, specialLevelMappings, levelUpMsg } from "../lib/LevelDefine.js";
import { WorldDB } from "../lib/WorldDB.js";
export const ExpDB = new WorldDB("xp");
export const LevelDB = new WorldDB("level");

/**
 * 對玩家顯示等即系統選單
 * @param {Minecraft.Player} player 玩家
 */
export function LevelSystem(player){
    let level = LevelDB.getRawData(player);
    let exp = ExpDB.getRawData(player);
    
    if (level == null) { level = "0" };
    
    let fm = new ui.ActionFormData();
    fm.title(`等級系統`);
    fm.body(`您目前為§aLv.${level}§r\n\n等級獎勵:`);
    fm.button(`查看等級排名`,);
    
    fm.show(player).then(response => {
        if (!response) return;
    });
}

/**
 * 為玩家添加經驗值
 * @param {Minecraft.Player} player 目標玩家
 * @param {number} exp 經驗值數量
 * @returns 
 */
export function addXp(player,exp) {
    // 取得玩家經驗值與等級
    let player_level = LevelDB.getRawData(player);
    const player_exp = ExpDB.getRawData(player);
    // 若玩家等即尚未初始化則歸零
    if (player_level == null) {
        player_level = 0;
        LevelDB.setRawData(player, 0);
    }
    //添加經驗值
    ExpDB.addRawData(player, exp);
    // 經驗值大於所需經驗，即升級
    if (player_exp >= DefMaxXp(player_level)) {
        // 歸零經驗值並添加等級
        ExpDB.setRawData(player, 0);
        LevelDB.addRawData(player, 1);
        // 升級特效/音效
        cmd(`title "${player.name}" title §b恭喜升級`);
        cmd(`title "${player.name}" subtitle §e已經升上 §a${++player_level} §e等`);
        log(`>> §b${player.name} §e成功升到了 §b${player_level} §e等！`);
        cmd(`playsound random.levelup "${player.name}"`);
        // 玩家等級的特殊等級map
        const specialLevelData = specialLevelMappings[player_level];
        // 若無該特殊等級資料或訊息就return
        if (!specialLevelData || specialLevelData.text === "") return;
        // 發送特殊等級訊息
        logfor(player, `${specialLevelData.text}`);
        // 如果有就執行特殊等級指令
        if (specialLevelData.handler !== []) {
            executeCmds(player, specialLevelData.handler);
        }
    }
}