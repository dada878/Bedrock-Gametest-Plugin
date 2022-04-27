import { cmd, log, logfor } from './GameLibrary.js';
import { ExpDB, LevelDB } from "../system/level.js";
import { levelFactor } from "../config.js"
export function DefMaxXp(level){
    return level ** 2 * levelFactor ;
};
export const levelUpMsg = ">> §b恭喜!您升到了§aLv.%l";

export const specialLevelMappings = {
    10: {
        text: ">> §a獲得10級特殊獎勵鑽石x3！",
        handler: ["give @s diamond 3", "say hello"]
    },
    20: {
        text: ">> §a獲得20級特殊獎勵綠寶石x1！",
        handler: ["give @s emerald"]
    }
}