import { cmd, log, logfor } from './GameLibrary.js';
import { ExpDB, LevelDB } from "../system/level.js";
import { levelFactor } from "../config.js"
export function DefMaxXp(level){
    return level ** 2 * levelFactor
};
export const levelUpMsg = "恭喜!您升到了§aLv.%1"

export const specialLevelMappings = {
    10: {
        text: "恭喜升級到10級！",
        handler: ["give @a[tag=plugin.target] diamond 3", "say abc d efg hijk lmnop"]
    },
    20: {
        text: "恭喜升級到20級！",
        handler: ["give @a[tag=plugin.target] emerald"]
    }
}