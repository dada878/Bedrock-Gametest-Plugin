import { cmd, log, logfor } from './GameLibrary.js';
import { ExpDB, LevelDB } from "../system/level.js";
import { levelFactor } from "../config.js"
export function DefMaxXp(level){
    return level ** 2 * levelFactor;
};
export const levelUpMsg = ">> §b恭喜!您升到了§aLv.%level%";

export const specialLevelMappings = {
    10: {
        text: ">> §b恭喜升級到10級！",
        handler: ["give @a[tag=plugin.target] diamond 3", "say abc d efg hijk lmnop"]
    },
    20: {
        text: ">> §b恭喜升級到20級！",
        handler: ["give @a[tag=plugin.target] emerald"]
    }
}