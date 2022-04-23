import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import {cmd, GetScores, log, logfor} from './lib/GametestFunctions.js';
import {ChangeChat, sendMessage} from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import {HomeSystem} from "./system/home.js"
import { TpaSystem } from "./system/tpa.js";
import { SpawnTp } from "./system/spawnTp.js";
import { WarpMenu } from "./system/warp.js";
import { PlayerMenu } from "./mainMenu/player.js";

// 嘗試創建記分板
try { cmd("scoreboard objectives add plugin_setting dummy"); } catch {}

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    sendMessage(player,message);
})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
})