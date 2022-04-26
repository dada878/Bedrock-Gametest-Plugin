import { world } from "mojang-minecraft";
import { cmd, cmds, log, logfor } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";
import { db } from "./mainMenu/admin.js";
import { prefix, baseXP } from "./config.js";
import { ExpDB, LevelDB } from "./system/level.js";
import { DefMaxXp, specialLevelMappings, levelUpMsg } from "./lib/LevelDefine.js";

//當傳送訊息
world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    // 發送訊息
    if (!message.startsWith(prefix)) return sendMessage(player, message);

    //發送指令
    let command = message
        .trim()
        .slice(prefix.length)
        .split(/ +/)[0]
        .toLowerCase(); 
    
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

//當玩家加入
world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player

    const enable = db.getData("JoinMsgOption");
    const msg = db.getData("JoinMessage");

    if (enable == 1) {
        logfor(player, msg);
    }

});

//當方塊破壞
world.events.blockBreak.subscribe(eventData =>{
    const player = eventData.player;
    const block = eventData.block;

    const exp = Math.round(Math.random() * baseXP);
    const player_level = LevelDB.getRawData(player);
    const player_exp = ExpDB.getRawData(player);

    if (player_level == null){
        player_level = 0;
        LevelDB.setRawData(player,0);
    }

    ExpDB.addRawData(player,exp)

    if (player_exp >= DefMaxXp(player_level)){
        LevelDB.addRawData(player,1)
        let specialText = ""
        if(specialLevelMappings[++player_level] && specialLevelMappings[player_level].text !== ""){
            specialText = `\n${specialLevelMappings[player_level].text}`
            if(specialLevelMappings[player_level].handler !== []){
                player.addTag("plugin.target");
                cmds(specialLevelMappings[player_level].handler)
                player.removeTag("plugin.target");
            }
        }
        logfor(player, `${levelUpMsg.replace(/%1+/, String(player_level))}${specialText}`)
    }
})

//物品使用
world.events.itemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
});

world.events.tick.subscribe(eventData => {
    const players = world.getPlayers();

    for (let player of players) {
        const tags = player.getTags();
        
        for (let tag of tags) {

            if (tag.startsWith("RANK:")) {
                let rank = tag.substring(5,tag.length);

                
            }
        }
    }

});

function enchantTest(player) {
    
    //測試
    let inv = player.getComponent("inventory").container;
    let item = inv.getItem(0);

    let enchants = item.getComponent("enchantments").enchantments;

    // for (let i in enchants) {
    //     log(i)
    //     log(i.constructor.name)
    // }

    let iterator = enchants[Symbol.iterator]()

    log(iterator.constructor.name)
    log(enchants.enchantmentType)

    for (let i in iterator) {
        log(i.constructor.name)
        log(i)
    }

    for (let i in enchants) {
        log(i.constructor.name)
        log(i)
    }

}

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