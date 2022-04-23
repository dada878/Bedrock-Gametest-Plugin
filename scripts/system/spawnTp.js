import { GetScores, logfor } from "../lib/GametestFunctions";

export function SpawnTp( player) {

    if (GetScores("spawnTp","plugin_setting") == 1) {return logfor(player, ">> §c無法使用，此功能已被禁用")};

    const posX = GetScores("spawn-x","plugin_setting");
    const posY = GetScores("spawn-y","plugin_setting");
    const posZ = GetScores("spawn-z","plugin_setting");

    if (posX == null) return logfor(player, ">> §c大廳座標尚未被設定，請找管理員使用管理員選單配置");

    player.runCommand(`tp ${posX} ${posY} ${posZ}`);
}