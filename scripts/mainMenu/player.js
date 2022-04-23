import * as ui from 'mojang-minecraft-ui';
import { GetScores } from '../lib/GametestFunctions.js';

import { ChangeChat } from '../system/chat.js'
import { HomeSystem } from "../system/home.js"
import { TpaSystem } from "../system/tpa.js";
import { SpawnTp } from "../system/spawnTp.js";
import { WarpMenu } from "../system/warp.js";

export function PlayerMenu(player) {
    let fm = new ui.ActionFormData();
    fm.title("功能選單");
    fm.body("這是一個功能非常強大的選單");

    if (GetScores("spawnTp", "plugin_setting") == 1) {
        fm.button('§l§1返回大廳\n§r§4此功能已被管理員禁用', 'textures/ui/world_glyph_color.png');
    } else fm.button('§l§1返回大廳', 'textures/ui/world_glyph_color.png');

    if (GetScores("title", "plugin_setting") == 1) {
        fm.button('§l§1稱號系統\n§r§4此功能已被管理員禁用', 'textures/ui/mute_off.png');
    } else fm.button('§l§1稱號系統', 'textures/ui/mute_off.png');

    if (GetScores("home", "plugin_setting") == 1) {
        fm.button('§l§1家園系統\n§r§4此功能已被管理員禁用', 'textures/ui/icon_recipe_item.png');
    } else fm.button('§l§1家園系統', 'textures/ui/icon_recipe_item.png');

    if (GetScores("tpa", "plugin_setting") == 1) {
        fm.button('§l§1玩家互傳\n§r§4此功能已被管理員禁用', 'textures/ui/icon_multiplayer.png');
    } else fm.button('§l§1玩家互傳', 'textures/ui/icon_multiplayer.png');

    const FROM_RESPONSES = {
        0: SpawnTp,
        1: ChangeChat,
        2: HomeSystem,
        3: TpaSystem
    }

    fm.show(player).then(response => {
        if (!response) return;

        FROM_RESPONSES[response.selection](player);
    })
}