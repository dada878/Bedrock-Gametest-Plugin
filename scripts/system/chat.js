import * as ui from 'mojang-minecraft-ui';
import { log, logfor, GetScores } from '../lib/GameLibrary.js';
import { getData, setData } from '../lib/JsonTagDB';

import { WorldDB } from "../lib/WorldDB.js";
import { LevelDB } from './level.js';
var db = new WorldDB("plugin_database");

export function ChangeChat(player) {
    if (db.getData("title") == 1) { return logfor(player, ">> §c無法使用，此功能已被禁用") };

    checkTitle(player)

    let hasTitles = getData(player, "hasTitles");

    let fm = new ui.ModalFormData();
    fm.title("稱號系統");
    fm.dropdown("選擇要配戴的稱號", hasTitles)

    fm.show(player).then(response => {
        if (!response) return;

        let tagId = response.formValues[0];

        setData(player, "selectedTitle", hasTitles[tagId]);

        logfor(player.name, ">> §a配戴成功")
    })
}

export function sendMessage(player, message) {
    checkTitle(player);

    const title = getData(player, "selectedTitle");
    const level = LevelDB.getRawData(player);
    
    if (level == null) {level = 0}

    log(`[§bLv.${level}§r][${title}§r]${player.name} >> ${message}`);
}

function checkTitle(player) {
    if (getData(player, "hasTitles") == null) {
        setData(player, "hasTitles", ["§a玩家"]);
    }
    if (getData(player, "selectedTitle") == null) {
        setData(player, "selectedTitle", getData(player, "hasTitles")[0]);
    }
}