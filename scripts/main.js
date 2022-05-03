import { world } from "mojang-minecraft";
import { cmd, cmds, log, logfor } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";
import { addXp } from "./system/level.js";
import { pluginDB, prefix, baseXP, enables } from "./config.js";
import { WorldDB } from "./lib/WorldDB.js";

//當傳送訊息
world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    // 發送訊息
    if (!message.startsWith(prefix)) return sendMessage(player, message);

    //發送指令
    let command = message
        .trim() //去除兩邊空格
        .slice(prefix.length) //刪除prefix
        .split(/ +/)[0] //取得主指令
        .toLowerCase(); //轉成小寫

    switch (command) {
        case "menu": {
            cmd(`give ${player.name} mcc:menu 1 0`);
            break;
        }
        case "admin_menu": {
            if (!player.hasTag("admin")) return logfor(player.name, '§c您沒有權限! 需要 "admin" Tag');
            cmd(`give ${player.name} mcc:admin_menu 1 0`);
            break;
        }
        case "getjoinmotd": {
            logfor(player, pluginDB.table("joinSetting").getData("message"));
            break;
        }
        default: {
            logfor(player, ">> §c未知的指令");
            break;
        }

    }
    
});

//當玩家加入
world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player

    const enable = enables.getData("JoinMsgOption");
    const msg = pluginDB.table("joinSetting").getData("message");
    
    if (enables.getData("") == 1) {
        logfor(player, msg);
        
    }

});

//當方塊破壞
world.events.blockBreak.subscribe(eventData => {
    const player = eventData.player;
    const block = eventData.block;

    let exp = Math.round(Math.random() * baseXP)

    addXp(player,exp);
})

//物品使用
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