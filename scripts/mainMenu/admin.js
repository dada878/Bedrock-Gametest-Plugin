import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetScores, log, logfor, SetScores } from '../lib/GametestFunctions.js';
import { getData, setData } from '../lib/JsonTagDB';

export function AdminMenu(player) {
    let fm = new ui.ActionFormData();
    fm.title("管理員選單");
    fm.body("管理員專用，內有許多方便的功能");
    fm.button('§l§1插件設定', 'textures/ui/automation_glyph_color.png');
    fm.button('§l§1給予稱號', 'textures/ui/mute_off.png');
    fm.button('§l§1移除稱號', 'textures/ui/mute_on.png');
    fm.button('§l§1踢出玩家', 'textures/ui/anvil_icon.png');

    fm.show(player).then(response => {
        if (!response) return;

        const worldPlayers = world.getPlayers();
        let players = [];
        let playerNames = [];

        for (let i of worldPlayers) {
            playerNames.push(i.name);
            players.push(i);
        }

        switch (response.selection) {
            case (0): {

                const enableList = [
                    (function(){if (GetScores("spawnTp","plugin_setting") == 0) {return false} else {return true}})(),
                    (function(){if (GetScores("title","plugin_setting") == 0) {return false} else {return true}})(),
                    (function(){if (GetScores("home","plugin_setting") == 0) {return false} else {return true}})(),
                    (function(){if (GetScores("tpa","plugin_setting") == 0) {return false} else {return true}})(),
                ]

                const x = GetScores("spawn-x","plugin_setting") ?? 0;
                const y = GetScores("spawn-y","plugin_setting") ?? 0;
                const z = GetScores("spawn-z","plugin_setting") ?? 0;
                
                let fm = new ui.ModalFormData();
                fm.title("插件設定");
                fm.textField("設定大廳座標(以空格隔開xyz)", "0 -60 0",`${x} ${y} ${z}`);
                fm.toggle("禁用返回大廳",Boolean(enableList[0]));
                fm.toggle("禁用稱號系統",Boolean(enableList[1]));
                fm.toggle("禁用家園系統",Boolean(enableList[2]));
                fm.toggle("禁用玩家互傳",Boolean(enableList[3]));

                fm.show(player).then(response => {
                    if (!response) return;

                    // 座標設定
                    const pos = response.formValues[0].split(" ");
                    SetScores("spawn-x", "plugin_setting", pos[0]);
                    SetScores("spawn-y", "plugin_setting", pos[1]);
                    SetScores("spawn-z", "plugin_setting", pos[2]);

                    // 功能開關
                    if (response.formValues[1]) { SetScores("spawnTp","plugin_setting",1) }
                    else { SetScores("spawnTp","plugin_setting",0) }

                    if (response.formValues[2]) { SetScores("title","plugin_setting",1) }
                    else { SetScores("title","plugin_setting",0) }

                    if (response.formValues[3]) { SetScores("home","plugin_setting",1) }
                    else { SetScores("home","plugin_setting",0) }

                    if (response.formValues[4]) { SetScores("tpa","plugin_setting",1) }
                    else { SetScores("tpa","plugin_setting",0) }

                    logfor(player, ">> §a設定成功");
                });


                break;
            } case (1): {
                let fm = new ui.ModalFormData();
                fm.title("給予稱號");
                fm.dropdown("選擇目標玩家", playerNames);
                fm.textField("輸入稱號", "");

                fm.show(player).then(response => {
                    if (!response) return;
                    if (!response.formValues[1]) return logfor(player, ">> §c稱號欄位不能為空");

                    let target = players[response.formValues[0]];
                    let hasTitles = getData(target, "hasTitles");
                    hasTitles.push(response.formValues[1]);

                    setData(target, "hasTitles", hasTitles);
                    logfor(player.name, ">> §a給予成功");
                })
                break;
            } case (2): {
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
                    let hasTitles = getData(target, "hasTitles");

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
                });
                break;
            } case (3): {
                let fm = new ui.ModalFormData();
                fm.title("踢人系統");
                fm.dropdown("選擇要踢出的玩家", playerNames);
                fm.textField("輸入理由(可留空)", "");

                fm.show(player).then(response => {
                    if (!response) return;
                    const kick_player = playerNames[response.formValues[0]];
                    const because = response.formValues[1];

                    cmd(`kick "${kick_player}" ${because}`);
                    logfor(player, ">> §a踢出成功");
                })
                break;
            } default: {

            }
        }
    })
}

function give_rank() {

}