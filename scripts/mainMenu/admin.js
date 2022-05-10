import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { enables, pluginDB } from "../config.js";
import { cmd, GetScores, log, logfor, rawcmd, SetScores } from '../lib/GameLibrary.js';
import { getData, setData } from '../lib/JsonTagDB';

import { buttons } from "./buttons.js";

export function AdminMenu(player) {
    let fm = new ui.ActionFormData();
    fm.title("管理員選單");
    fm.body("管理員專用，內有許多方便的功能");
    fm.button('§l§1插件設定', 'textures/ui/automation_glyph_color.png');
    fm.button('§l§1給予稱號', 'textures/ui/mute_off.png');
    fm.button('§l§1移除稱號', 'textures/ui/mute_on.png');
    fm.button('§l§1踢出玩家', 'textures/ui/anvil_icon.png');
    fm.button('§l§1管理傳送點', 'textures/ui/worldsIcon.png');

    fm.show(player).then(response => {
        if (!response || response.isCanceled) return;

        const worldPlayers = world.getPlayers();
        let players = [];
        let playerNames = [];

        for (let i of worldPlayers) {
            playerNames.push(i.name);
            players.push(i);
        }

        switch (response.selection) {
            case (0): {

                let fm = new ui.ActionFormData();
                fm.title("管理員選單");
                fm.body("管理員專用，內有許多方便的功能");
                fm.button('§l§1功能設置');
                fm.button('§l§1開關功能');

                fm.show(player).then(response => {
                    switch (response.selection) {
                        case (0): {
                            const setting = pluginDB.table("spawnTpSetting");
                            const pos = setting.getData("pos") ?? "0 -60 0";
                            const message = pluginDB.table("joinSetting").getData("message") ?? "歡迎加入！";
                            const board = pluginDB.table("moneySetting").getData("scoreboard") ?? "money";

                            let fm = new ui.ModalFormData();
                            fm.title("功能設置");
                            fm.textField("設定大廳座標(以空格隔開xyz)", "x y z", pos);
                            fm.textField('輸入歡迎訊息(將作為玩家加入時的用語)', '', message);
                            fm.textField('設置經濟系統的計分板', '', board);

                            fm.show(player).then(response => {
                                if (!response || response.isCanceled) return;
                                
                                const pos = response.formValues[0].trim();
                                // 座標設定
                                // 過一次regex看看是不是有效坐標
                                if(pos.match(/(-)?\d{1,8} (-)?\d{1,8} (-)?\d{1,8}/)) setting.setData("pos", pos);
                                else logfor(player, ">> §c無效坐標！請重新設置出生點坐標");

                                // 加入訊息設定
                                pluginDB.table("joinSetting").setData("message", response.formValues[1]);

                                // 經濟
                                pluginDB.table("moneySetting").setData("scoreboard", response.formValues[2]);

                                logfor(player, ">> §a設定成功！");
                            });
                            break;
                        };
                        case (1): {
                            let isData = function (key) { if (enables.getData(key) == 1) { return false } else return true; };
                            let boolCvt = function (key) { if (key) return 0; else return 1; }; //奇怪的bug，暫時修改
                            let fm = new ui.ModalFormData();
                            fm.title("開關功能");
                            let enableList = [];
                            buttons.forEach((data, index) => {
                                if (isData(data.id)) {
                                    enableList[index] = true;
                                } else {
                                    enableList[index] = false;
                                }
                                fm.toggle(`啟用${data.display}`, enableList[index]);
                            });

                            fm.show(player).then(response => {
                                response.formValues.forEach((data, index) => {
                                    enables.setData(buttons[index].id, boolCvt(data))
                                })
                                logfor(player, ">> §a設定成功！");
                            });
                            break;
                        };
                    }
                })
                return;
                break;
            }
            case (1): {
                let fm = new ui.ModalFormData();
                fm.title("給予稱號");
                fm.dropdown("選擇目標玩家", playerNames);
                fm.textField("輸入稱號", "");

                fm.show(player).then(response => {
                    if (!response || response.isCanceled) return;
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
                    if (!response || response.isCanceled) return;

                    let target = players[response.formValues[0]];
                    let hasTitles = getData(target, "hasTitles");

                    let fm = new ui.ModalFormData();
                    fm.title("移除稱號");
                    fm.dropdown("選擇要移除的稱號", hasTitles);

                    fm.show(player).then(response => {
                        if (!response || response.isCanceled) return;

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
                    if (!response || response.isCanceled) return;
                    const kick_player = playerNames[response.formValues[0]];
                    const because = response.formValues[1];

                    if (rawcmd(`kick "${kick_player}" ${because}`).error) {
                        logfor(player, ">> §c踢出失敗");
                    } else {
                        logfor(player, ">> §a踢出成功");
                    }
                })
                break;

            } case (4): {

                let fm = new ui.ActionFormData();
                fm.title("管理傳送點");
                fm.body("快速刪除、添加傳送點！")
                fm.button("§l§1添加傳送點");
                fm.button("§l§1移除傳送點");

                fm.show(player).then(response => {
                    if (!response || response.isCanceled) return;

                    const warpsTable = pluginDB.table("warps");
                    let warps = warpsTable.getAllData();

                    let warpNames = [];

                    for (let i in warps) { warpNames.push(i); }

                    if (response.selection == 0) {

                        let fm = new ui.ModalFormData();
                        fm.title("管理傳送點");
                        fm.textField("傳送點名稱", "");
                        fm.textField("傳送點座標", "x y z");

                        fm.show(player).then(response => {
                            if (!response || response.isCanceled) return;

                            const warpName = response.formValues[0];
                            const warpPos = response.formValues[1];

                            warpsTable.setData(warpName, warpPos);

                            logfor(player, ">> §a添加成功");
                        })
                    } else if (response.selection == 1) {

                        if (warpNames.length == 0) { return logfor(player, ">> §c本世界沒有設定任何傳送點"); }

                        let fm = new ui.ModalFormData();
                        fm.title("移除傳送點");
                        fm.dropdown("選擇要移除的傳送點", warpNames);

                        fm.show(player).then(response => {
                            if (!response || response.isCanceled) return;

                            const warpName = warpNames[response.formValues[0]];

                            warpsTable.deleteData(warpName);

                            logfor(player, ">> §a移除成功");
                        })
                    }

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


