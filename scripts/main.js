import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import {cmd, GetWorldPlayersName, log, logfor} from './lib/GametestFunctions.js';
import {getData, setData} from './lib/JsonTagDB.js';
import {ChangeChat, sendMessage} from './system/chat.js'
import { AdminMenu } from "./system/admin.js";

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;

    const player = eventData.sender;
    const message = eventData.message;

    sendMessage(player,message);
})

world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player
    log(`§a${player} §r歡迎來到§kmdalkda`);
})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id != "minecraft:clock") return;
    
    let fm = new ui.ActionFormData();
    fm.title("玩家設定");
    fm.body("made by 冰川MCC");
    fm.button('§l§5稱號系統', 'textures/ui/mute_off.png');
    fm.button('§l§5家園系統', 'textures/ui/icon_recipe_item.png');
    fm.button('§l§5玩家互傳', 'textures/ui/icon_multiplayer.png');
    fm.button('§l§5匯款系統', 'textures/ui/MCoin.png');
    if (player.hasTag("admin")) fm.button('§l§5管理員選單', 'textures/ui/dev_glyph_color.png');

    const FROM_RESPONSES = {
        0:ChangeChat,
        4:AdminMenu
    }

    fm.show(player).then(response => {
        if (!response) return;

        FROM_RESPONSES[response.selection](player);
    })
})

