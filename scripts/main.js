import { world } from "mojang-minecraft";
import { cmd, log } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

<<<<<<< HEAD
    sendMessage(player,message);
})

world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player

    log(`§e${player} §r歡迎來到§kmdalkda`);

    cmd(`give "${player}" clock 0 1`)
=======
    sendMessage(player, message);
>>>>>>> 447646f8fa6e077d0bf2743d4311a6af065dfe9d
})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
})