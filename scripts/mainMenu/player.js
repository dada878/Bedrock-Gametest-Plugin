import * as ui from 'mojang-minecraft-ui';
import { GetScores, log, logfor } from '../lib/GameLibrary.js';
import {buttons, color, disableColor, disableIcon, disableText} from "./buttons.js";

const noone = ((player) => {logfor(player, ">> 本功能暫未開放！")})

import { WorldDB } from "../lib/WorldDB.js";
var db = new WorldDB("plugin_database");

export function PlayerMenu(player) {
    let fm = new ui.ActionFormData();
    fm.title("功能選單");
    fm.body("這是一個功能非常強大的選單");

    buttons.forEach((data) => {
        let buttonText, icon;
        if(db.getData(data.id) == 1){
            buttonText = `§r${color}${data.display}\n§r${disableColor}${disableText}`
            icon = disableIcon
        }else{
            buttonText = `§r${color}${data.display}`
            icon = data.icon
        }
        fm.button(buttonText, icon);
    })

    fm.show(player).then(response => {
        if (!response) return;

        buttons[response.selection].handler(player);
    })
}