import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetScores, log, logfor, SetScores } from '../lib/GameLibrary.js';
import { getData, setData } from '../lib/JsonTagDB';

import { WorldDB } from "../lib/WorldDB.js";
var db = new WorldDB("plugin_database");

import {buttons} from "./buttons.js";

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
                
                let fm = new ui.ActionFormData();
                fm.title("管理員選單");
                fm.body("管理員專用，內有許多方便的功能");
                fm.button('§l§1功能設置');
                fm.button('§l§1開關功能');

                fm.show(player).then(response => {
                    switch (response.selection) {
                        case (0): {

                            const x = db.getData("spawn-x") ?? 0;
                            const y = db.getData("spawn-y") ?? 0;
                            const z = db.getData("spawn-z") ?? 0;

                            let fm = new ui.ModalFormData();
                            fm.title("功能設置");
                            fm.textField("設定大廳座標(以空格隔開xyz)(支持使用~)", "0 -60 0", `${x} ${y} ${z}`);
                            fm.textField('輸入歡迎訊息 (將作為玩家加入時的用語)','');

                            fm.show(player).then(response => {
                                if (!response) return;

                                // 座標設定
                                const pos = response.formValues[0].split(" ");
                                db.setData("spawn-x", toRelativePosition(pos[0], player, "x"));
                                db.setData("spawn-y", toRelativePosition(pos[1], player, "y"));
                                db.setData("spawn-z", toRelativePosition(pos[2], player, "z"));

                                // 加入訊息設定
                                const msg = response.formValues[1]
                                db.setData("JoinMessage",msg);
                            });
                        };
                        case(1): {
                            let isData = function(key){if (db.getData(key) == 1) {return false} else return true;};
                            let boolCvt = function(key){if(key)return 1;else return 0;};
                            let fm = new ui.ModalFormData();
                            fm.title("開關功能");
                            let enableList = [];
                            buttons.forEach((data, index) => {
                                if(isData(data.id)){
                                    enableList[index] = true;
                                }else{
                                    enableList[index] = false;
                                }
                                fm.toggle(`禁用${data.display}`, enableList[index]);
                                logfor(player, ">> §a設定成功！");
                            });

                            fm.show(player).then(response => {
                                response.formValues.forEach((data, index) => {
                                    db.setData(buttons[index].id, boolCvt(data))
                                })
                                logfor(player, ">> §a設定成功！");
                            });
                        };
                    }
                })
                break;
            }
            case (1): {
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

            } case (4): {

                let fm = new ui.ActionFormData();
                fm.title("管理傳送點");
                fm.body("快速刪除、添加傳送點！")
                fm.button("§l§1添加傳送點");
                fm.button("§l§1移除傳送點");

                fm.show(player).then(response => {
                    if (!response) return;

                    const data = db.getData("warps");
                    let warps;

                    if (data == null) {
                        warps = {};
                    } else {
                        warps = JSON.parse(data);
                    }

                    let warpNames = [];

                    for (let i in warps) { warpNames.push(i); }

                    if (response.selection == 0) {

                        let fm = new ui.ModalFormData();
                        fm.title("管理傳送點");
                        fm.textField("傳送點名稱", "");
                        fm.textField("傳送點座標(以空格隔開xyz)", "0 -60 53");

                        fm.show(player).then(response => {
                            if (!response) return;

                            const warpName = response.formValues[0];
                            const warpPos = response.formValues[1];

                            warps[warpName] = warpPos;

                            db.setData("warps", JSON.stringify(warps));
                            logfor(player, ">> §a添加成功");
                        })
                    } else if (response.selection == 1) {

                        if (data == null) { return logfor(player, ">> §c本世界沒有設定任何傳送點"); }

                        let fm = new ui.ModalFormData();
                        fm.title("移除傳送點");
                        fm.dropdown("選擇要移除的傳送點", warpNames);

                        fm.show(player).then(response => {
                            if (!response) return;

                            const warpName = warpNames[response.formValues[0]];

                            delete warps[warpName];

                            db.setData("warps", JSON.stringify(warps));
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

function give_rank() {

}

/**
 * @name toRelativePosition
 * @description
 * @param {object} player - The player that have the Vec3
 * @param {object} string - the string that we are parsing
 * @param {object} axis - the axis of what you are converting
 */
function toRelativePosition(string, player, axis = "x"){
    if(string.match(/~([0-9]{1,})?/)){
        var offset = string.slice(1) * 1 //避免情況
        if(offset) return Math.floor(player.location[axis]) + offset
        return Math.floor(player.location[axis])
    }else return parseInt(string.replace(/~+/,""))
}


export { db }
