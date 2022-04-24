import { world } from "mojang-minecraft";
import { cmd, log, logfor } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";
import { db } from "./mainMenu/admin.js";

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    if(message == "-get"){
        cmd(`give ${player.name} mcc:menu 1 0`);
    }
    
    if(message == "-getad"){

        if(player.getTags().indexOf("admin") != -1){
            cmd(`give ${player.name} mcc:admin_menu 1 0`);
        }

        else{
            logfor(player,'§c您沒有權限! 需要 "admin" Tag');
        }
    }

    if(message == "-getJoinMessage"){
        logfor(player.name,db.getData("JoinMessage"));
    }

    else{
        sendMessage(player,message);
    }

});

world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player

    const JoinMessage = {
        "opening" : db.getData("JoinMsgOption"),
        "msg" : db.getData("JoinMessage")
    }
    
    if(JoinMessage["opening"] == 1){
        logfor(player.name,JoinMessage["msg"])
    }

})

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
})