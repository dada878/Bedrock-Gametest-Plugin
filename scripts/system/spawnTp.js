import { GetScores, logfor } from "../lib/GameLibrary";
import { WorldDB } from "../lib/WorldDB.js";

var db = new WorldDB("plugin_database");

export function SpawnTp(player) {

    if (db.getData("spawnTp") == 1) { return logfor(player, ">> §c無法使用，此功能已被禁用") };

    const posX = db.getData("spawn-x");
    const posY = db.getData("spawn-y");
    const posZ = db.getData("spawn-z");

    if (posX == null || posY == null || posZ == null) return logfor(player, ">> §c大廳座標尚未被設定，請找管理員使用管理員選單配置");

    player.runCommand(`tp ${posX} ${posY} ${posZ}`);
}