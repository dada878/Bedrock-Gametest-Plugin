import { ChangeChat } from '../system/chat.js'
import { HomeSystem } from "../system/home.js"
import { TpaSystem } from "../system/tpa.js";
import { SpawnTp } from "../system/spawnTp.js";
import { WarpMenu } from "../system/warp.js";
import { LevelSystem } from "../system/level.js";
import { MoneySystem } from "../system/money.js";
import { ShopSystem } from "../system/money.js";

import { logfor } from '../lib/GameLibrary.js';
const noone = ((player) => { logfor(player, ">> §c本功能暫未開放！") })

export const buttons = [
    {
        id: "spawnTp",
        display: "返回大廳",
        icon: "textures/ui/village_hero_effect.png",
        handler: SpawnTp
    },
    {
        id: "title",
        display: "稱號系統",
        icon: "textures/ui/mute_off.png",
        handler: ChangeChat
    },
    {
        id: "warp",
        display: "世界傳送點",
        icon: "textures/ui/world_glyph_color.png",
        handler: WarpMenu
    },
    {
        id: "home",
        display: "家園系統",
        icon: "textures/ui/icon_recipe_item.png",
        handler: HomeSystem
    },
    {
        id: "tpa",
        display: "玩家互傳",
        icon: "textures/ui/icon_multiplayer.png",
        handler: TpaSystem
    },
    {
        id: "money",
        display: "經濟系統",
        icon: "textures/ui/MCoin.png",
        handler: MoneySystem
    },
    {
        id: "shop",
        display: "商店系統",
        icon: "textures/ui/MCoin.png",
        handler: ShopSystem
    },
    {
        id: "level",
        display: "等級系統",
        icon: "textures/items/experience_bottle.png",
        handler: LevelSystem
    },
];
export const color = "§l§1";
export const disableColor = "§4";
export const disableText = "此功能已被管理員禁用";
export const disableIcon = "textures/ui/realms_red_x.png";
