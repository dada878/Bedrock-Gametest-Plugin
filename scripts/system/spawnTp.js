import { enables, pluginDB } from "../config";
import { logfor } from "../lib/GameLibrary";

const setting = pluginDB.table("spawnTpSetting");

export function SpawnTp(player) {

    if (enables.getData("spawnTp") == 1) { return logfor(player, ">> §c無法使用，此功能已被禁用") };

    const pos = setting.getData("pos");

    if (pos == null) return logfor(player, ">> §c大廳座標尚未被設定，請找管理員配置");

    player.runCommand(`tp ${pos}`);
}