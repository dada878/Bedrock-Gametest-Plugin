import * as ui from 'mojang-minecraft-ui';
import { GetScores, log } from '../lib/GameLibrary.js';

import { ChangeChat } from '../system/chat.js'
import { HomeSystem } from "../system/home.js"
import { TpaSystem } from "../system/tpa.js";
import { SpawnTp } from "../system/spawnTp.js";
import { WarpMenu } from "../system/warp.js";

import { WorldDB } from "../lib/WorldDB.js";
var db = new WorldDB("plugin_database");

export function PlayerMenu(player) {
    let fm = new ui.ActionFormData();
    fm.title("功能選單");
    fm.body("這是一個功能非常強大的選單");

    if (db.getData("spawnTp") == 1) {
        fm.button('§l§1返回大廳\n§r§4此功能已被管理員禁用', 'textures/ui/village_hero_effect.png');
    } else fm.button('§l§1返回大廳', 'textures/ui/village_hero_effect.png');

    if (db.getData("title") == 1) {
        fm.button('§l§1稱號系統\n§r§4此功能已被管理員禁用', 'textures/ui/mute_off.png');
    } else fm.button('§l§1稱號系統', 'textures/ui/mute_off.png');

    if (db.getData("warp") == 1) {
        fm.button('§l§1世界傳送點\n§r§4此功能已被管理員禁用', 'textures/ui/world_glyph_color.png');
    } else fm.button('§l§1世界傳送點', 'textures/ui/world_glyph_color.png');

    if (db.getData("home") == 1) {
        fm.button('§l§1家園系統\n§r§4此功能已被管理員禁用', 'textures/ui/icon_recipe_item.png');
    } else fm.button('§l§1家園系統', 'textures/ui/icon_recipe_item.png');

    if (db.getData("tpa") == 1) {
        fm.button('§l§1玩家互傳\n§r§4此功能已被管理員禁用', 'textures/ui/icon_multiplayer.png');
    } else fm.button('§l§1玩家互傳', 'textures/ui/icon_multiplayer.png');

    if (db.getData("money") == 1) {
        fm.button('§l§1經濟系統\n§r§4此功能已被管理員禁用', 'textures/ui/MCoin.png');
    } else fm.button('§l§1經濟系統', 'textures/ui/MCoin.png');

    if (db.getData("exp") == 1) {
        fm.button('§l§1等級系統\n§r§4此功能已被管理員禁用', 'textures/ui/MCoin.png');
    } else fm.button('§l§1等級系統', '');

    const FROM_RESPONSES = {
        0: SpawnTp,
        1: ChangeChat,
        2: WarpMenu,
        3: HomeSystem,
        4: TpaSystem
    }

    fm.show(player).then(response => {
        if (!response) return;

        FROM_RESPONSES[response.selection](player);
    })
}