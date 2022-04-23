import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetWorldPlayersName, log, logfor } from '../lib/GametestFunctions.js';
import {getData, setData} from '../lib/JsonTagDB';

export function ChangeChat(player) {
    
    checkTitle(player)

    let hasTitles = getData(player,"hasTitles");

    let fm = new ui.ModalFormData();
    fm.title("稱號系統");
    fm.dropdown("選擇要配戴的稱號", hasTitles)

    fm.show(player).then(response => {
        if (!response) return;

        let tagId = response.formValues[0];

        setData(player,"selectedTitle",hasTitles[tagId]);

        logfor(player.name,">> §a配戴成功")
    })
}

export function sendMessage(player,message) {

    checkTitle(player);

    const title = getData(player,"selectedTitle");

    log(`[${title}§r]${player.name} >> ${message}`);
}

function checkTitle(player) {
    if (getData(player,"hasTitles") == null) {
        setData(player,"hasTitles",["§a玩家"]);
    }
    if (getData(player,"selectedTitle") == null) {
        setData(player,"selectedTitle",getData(player,"hasTitles")[0]);
    }
}