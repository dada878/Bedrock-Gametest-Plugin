import { GetScores } from "../lib/GametestFunctions";

export function SpawnTp( player) {
    const posX = GetScores("spawn-x","plugin_setting");
    const posY = GetScores("spawn-y","plugin_setting");
    const posZ = GetScores("spawn-z","plugin_setting");

    player.runCommand(`tp ${posX} ${posY} ${posZ}`);
}