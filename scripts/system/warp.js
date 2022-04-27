import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { enables, pluginDB } from "../config.js";
import { cmd, log, logfor } from '../lib/GameLibrary.js';

export function WarpMenu(player) {

    if (enables.getData("warp") == 1) return logfor(player, ">> §c無法使用，此功能已被禁用")

    let warps = pluginDB.table("warps").getAllData();
    
    let fm = new ui.ActionFormData();
    fm.title("世界傳送點");
    fm.body("選擇想傳送到的地方！");

    let pos = [];
    
    let count = 0;
    for (let key in warps) {
        fm.button(key);
        pos.push(warps[key]);
        count++;
    }
    
    if (count == 0) return logfor(player, ">> §c本世界沒有設定任何傳送點");

    fm.show(player).then(response => {
        if (!response) return;
        player.runCommand(`tp ${pos[response.selection]}`);
        logfor(player, ">> §e傳送成功");
    })
}