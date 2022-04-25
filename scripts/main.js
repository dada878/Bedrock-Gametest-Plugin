import { world } from "mojang-minecraft";
import { cmd, log, logfor } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";
import { db } from "./mainMenu/admin.js";
import { prefix } from "./config.js";

world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    // 發送訊息
    if (!message.startsWith(prefix)) return sendMessage(player, message);

    let command = message
        .slice(prefix.length)
        .split(/ +/)[0]
        .toLowerCase(); 
    
    //
    switch (command){
        case "menu":{
            cmd(`give ${player.name} mcc:menu 1 0`);
            break;
        }
        case "admin_menu":{
            if (!player.hasTag("admin")) return logfor(player.name, '§c您沒有權限! 需要 "admin" Tag');
            cmd(`give ${player.name} mcc:admin_menu 1 0`);
            break;
        }
        case "getjoinmotd":{
            logfor(player.name, db.getData("JoinMessage"));
            break;
        }
        default:{
            logfor(player, ">> §c未知的指令");
            break;
        }
        
    }
});

world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player

    const enable = db.getData("JoinMsgOption");
    const msg = db.getData("JoinMessage");

    if (enable == 1) {
        logfor(player, msg);
    }

});

world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
});

/*

                   ___====-_  _-====___
             _--^^^     //      \\     ^^^--_
          _-^          // (    ) \\          ^-_
         -            //  |\^^/|  \\            -
       _/            //   (@::@)   \\            \_
      /             ((     \\//     ))             \
     -               \\    (oo)    //               -
    -                 \\  / VV \  //                 -
   -                   \\/      \//                   -
  _ /|          /\      (   /\   )      /\          |\ _
  |/ | /\ /\ /\/  \ /\  \  |  |  /  /\ /  \/\ /\ /\ | \|
  `  |/  V  V  `   V  \ \| |  | |/ /  V   '  V  V  \|  '
     `   `  `      `   / | |  | | \   '      '  '   '
                      (  | |  | |  )
                     __\ | |  | | /__
                    (vvv(VVV)(VVV)vvv)
                   神獸保佑，程式碼沒Bug!
    
*/