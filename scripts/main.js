import { world } from "mojang-minecraft";
import { cmd, log } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    if(message == "-get"){
        cmd(`give ${player.name} mcc:menu 1 0`)
    }
    if("admin" in player.getTags){
        if(message == "-getad"){
            cmd(`give ${player.name} mcc:admin_menu 1 0`)
        }
    }

    sendMessage(player,message);
})

world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player

    sendMessage(player, message);

})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
})