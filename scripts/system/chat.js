import * as ui from 'mojang-minecraft-ui';
import * as Minecraft from 'mojang-minecraft';
import { log, logfor } from '../lib/GameLibrary.js';
import { getData, setData } from '../lib/JsonTagDB';
import { levelTable } from './level.js';
import { chatFormat, enables } from "../config.js";
/**
 * 對玩家顯示稱號選單
 * @param {Minecraft.Player} player 玩家
 * @return none
 */
export function ChangeChat(player) {

    if (enables.getData("title") == 1) { return logfor(player, ">> §c無法使用，此功能已被禁用") };

    checkTitle(player);

    let hasTitles = getData(player, "hasTitles");

    const tags = player.getTags();
    for (let tag of tags) {

        if (tag.startsWith("RANK:")) {
            const rank = tag.substring(5, tag.length);
            hasTitles.push(rank);
        }
    }

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
    let level = levelTable.getScoreDB(player.name);
    
    if (level == null) {level = 0}

    log(chatFormat
        .replace("%level%", String(level))
        .replace("%title%", title)
        .replace("%player%", player.nameTag ?? player.name)
        .replace("%content%", message)
    );
}

function checkTitle(player) {
    if (getData(player, "hasTitles") == null) {
        setData(player, "hasTitles", ["§a玩家"]);
    }
    if (getData(player, "selectedTitle") == null) {
        setData(player, "selectedTitle", getData(player, "hasTitles")[0]);
    }
}