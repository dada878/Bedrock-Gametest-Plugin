import { world } from "mojang-minecraft";
import { cmd, cmds, log, logfor } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";
import { addXp } from "./system/level.js";
import { pluginDB, prefix, baseXP, checkLore, checkEnchantment } from "./config.js";
import { WorldDB } from "./lib/WorldDB.js";
import {snakeToCamel, clearItem} from "./lib/util.js"

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
        // case "getjoinmotd": {
        //     logfor(player.name, db.getData("JoinMessage"));
        //     break;
        // }
        default: {
            logfor(player, ">> §c未知的指令");
            break;
        }

    }
    
});

//當玩家加入
world.events.playerJoin.subscribe(eventData => {
    return;
    const player = eventData.player

    const enable = db.getData("JoinMsgOption");
    const msg = db.getData("JoinMessage");

    if (enable == 1) {
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

World.events.tick.subscribe(() => {
    for (let player of World.getPlayers()) {
        let container = player.getComponent('inventory').container;
        for (let i = 0; i < container.size; i++) if (container.getItem(i)) {
            let item = container.getItem(i);
            if(item.amount > 64) clearItem(i)
            if(item.nameTag.length > 32) clearItem(i)

            if(checkLore && item.getLore().length) {
                logfor("@a[tag=admin]", `${player.name}擁有高於原版附魔的附魔，請注意！(data = {id=${item.id},lore=${item.getLore()}})`)
                clearItem(i)
            }

            if(checkEnchantment) {
                let itemEnchants = item.getComponent("enchantments").enchantments;
                for (let enchantment in Minecraft.MinecraftEnchantmentTypes) {
                    let enchantData = itemEnchants.getEnchantment(Minecraft.MinecraftEnchantmentTypes[enchantment]);
        
                    if(enchantData) {
                        if(enchantData.level > Minecraft.MinecraftEnchantmentTypes[enchantment].maxLevel || enchantData.level < 5){
                            logfor("@a[tag=admin]", `${player.name}擁有高於原版附魔的附魔，請注意！(data = {id=${item.id},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}})`)
                            clearItem(i)
                        }

                        let item2 = new Minecraft.ItemStack(Minecraft.MinecraftItemTypes[snakeToCamel(item.id)], 1, item.data);
                        if(!item2.getComponent("enchantments").enchantments.canAddEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantment], 1))) {
                            logfor("@a[tag=admin]", `${player.name}擁有原版附魔不應該附上的東西，請注意！(data = {id=${item.id},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}})`)
                            clearItem(i)
                        }
                    }
                }
            }
        }
    }
})
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