import { world } from "mojang-minecraft";
import { cmd, GetScores, log, logfor } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";

import * as base64 from "./lib/base64"
import * as scores from "./lib/ScoresFormat"


// 嘗試創建記分板
try { cmd("scoreboard objectives add plugin_setting dummy"); } catch { }

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    const scoresEncode = scores.encode(message);
    log(scoresEncode);
    log(scoresEncode.length);

    log(scores.decode(scoresEncode))

    sendMessage(player, message);
})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
})