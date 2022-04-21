import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetWorldPlayersName, log, logfor } from '../lib/GametestFunctions.js';
import {getData, setData} from '../lib/JsonTagDB';

function AdminMenu(player) {
    let fm = new ui.ActionFormData();
    fm.title("管理員選單");
    fm.body("made by 冰川MCC");
    fm.button('§l§5給予稱號', 'textures/ui/mute_off.png');
    fm.button('§l§5移除稱號', 'textures/ui/mute_on.png');
    fm.button('§l§5踢出玩家', 'textures/ui/smithing_icon.png');

    fm.show(player).then(response => {
        if (!response) return;

        const worldPlayers = world.getPlayers();
        let players = [];
        let playerNames = [];

        for (let i of worldPlayers) {
            playerNames.push(i.name);
            players.push(i);
        }

        if (response.selection == 0) {
            let fm = new ui.ModalFormData();
            fm.title("給予稱號");
            fm.dropdown("選擇目標玩家", playerNames);
            fm.textField("輸入稱號","");

            fm.show(player).then(response => {
                if (!response) return;
                if (!response.formValues[1]) return logfor(player,">> §c稱號欄位不能為空");

                let target = players[response.formValues[0]];
                let hasTitles = getData(target,"hasTitles");
                hasTitles.push(response.formValues[1]);

                setData(target,"hasTitles",hasTitles);
                logfor(player.name,">> §a給予成功");
            })
        } else if (response.selection == 1) {
            const worldPlayers = world.getPlayers();
            let players = [];
            let playerNames = [];
    
            for (let i of worldPlayers) {
                playerNames.push(i.name);
                players.push(i);
            }

            let fm = new ui.ModalFormData();
            fm.title("移除稱號");
            fm.dropdown("選擇目標玩家", playerNames);

            fm.show(player).then(response => {
                if (!response) return;

                let target = players[response.formValues[0]];
                let hasTitles = getData(target,"hasTitles");
                
                let fm = new ui.ModalFormData();
                fm.title("移除稱號");
                fm.dropdown("選擇要移除的稱號", hasTitles);

                fm.show(player).then(response => {
                    if (!response) return;

                    let selectedTitle = getData(player, "selectedTitle");

                    if (hasTitles[response.formValues[0]] == hasTitles[0]) {
                        return logfor(player.name, ">> §c你不能移除預設稱號");
                    }
                    
                    if (hasTitles[response.formValues[0]] == selectedTitle) {
                        setData(player, "selectedTitle", getData(player, "hasTitles")[0]);
                    }

                    hasTitles.pop(response.formValues[0]);
                    
                    setData(target, "hasTitles", hasTitles);

                    logfor(player.name, ">> §a移除成功");
                })
            })
        }
    })
}

export {AdminMenu};