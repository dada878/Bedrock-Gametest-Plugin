import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import {cmd, GetScores, log, logfor} from './lib/GametestFunctions.js';
import {getData, setData} from './lib/JsonTagDB.js';
import {ChangeChat, sendMessage} from './system/chat.js'
import { AdminMenu } from "./system/admin.js";
import {HomeSystem} from "./system/home.js"
import { TpaSystem } from "./system/tpa.js";
import { SpawnTp } from "./system/spawnTp.js";
import { WarpMenu } from "./system/warp.js";

// 嘗試創建記分板
try {
    cmd("scoreboard objectives add plugin_setting dummy");
} catch {}

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;

    const player = eventData.sender;
    const message = eventData.message;

    sendMessage(player,message);
})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id != "mcc:menu") return;

    let fm = new ui.ActionFormData();
    fm.title("功能選單");
    fm.body("這是一個功能非常強大的選單");

    if (GetScores("spawnTp","plugin_setting") == 1) {
        fm.button('§l§1返回大廳\n§r§4此功能已被管理員禁用', 'textures/ui/world_glyph_color.png');
    } else fm.button('§l§1返回大廳', 'textures/ui/world_glyph_color.png');

    if (GetScores("title","plugin_setting") == 1) {
        fm.button('§l§1稱號系統\n§r§4此功能已被管理員禁用', 'textures/ui/mute_off.png');
    } else fm.button('§l§1稱號系統', 'textures/ui/mute_off.png');

    if (GetScores("home","plugin_setting") == 1) {
        fm.button('§l§1家園系統\n§r§4此功能已被管理員禁用', 'textures/ui/icon_recipe_item.png');
    } else fm.button('§l§1家園系統', 'textures/ui/icon_recipe_item.png');

    if (GetScores("tpa","plugin_setting") == 1) {
        fm.button('§l§1玩家互傳\n§r§4此功能已被管理員禁用', 'textures/ui/icon_multiplayer.png');
    } else fm.button('§l§1玩家互傳', 'textures/ui/icon_multiplayer.png');

    if (player.hasTag("admin")) fm.button('§l§1管理員選單', 'textures/ui/dev_glyph_color.png');

    const FROM_RESPONSES = {
        0:SpawnTp,
        1:ChangeChat,
        2:HomeSystem,
        3:TpaSystem,
        4:AdminMenu
    }

    fm.show(player).then(response => {
        if (!response) return;

        FROM_RESPONSES[response.selection](player);
    })
})