import { world } from "mojang-minecraft";
import * as Minecraft from 'mojang-minecraft';
import { cmd, cmds, log, logfor, rawcmd, kickPlayer2, kickPlayer } from './lib/GameLibrary.js';
import { sendMessage } from './system/chat.js'
import { AdminMenu } from "./mainMenu/admin.js";
import { PlayerMenu } from "./mainMenu/player.js";
import { addXp } from "./system/level.js";
import { pluginDB, prefix, baseXP, checkLore, checkEnchantment, enables } from "./config.js";
import { WorldDB } from "./lib/WorldDB.js";
import { levelTable, expTable } from "./system/level.js";
import { clearItem, snakeToCamel } from './lib/util.js';
import * as detect from './system/tool.js'

const antiCheatSetting = pluginDB.table("antiCheatSetting");

//當傳送訊息
world.events.beforeChat.subscribe(eventData => {
    eventData.cancel = true;
    const player = eventData.sender;
    const message = eventData.message;

    // 發送訊息
    if (!message.startsWith(prefix)) sendMessage(player, message);

    else {

        //發送指令
        let command = message
            .trim() //去除兩邊空格
            .slice(prefix.length) //刪除prefix
            .split(/ +/)[0] //取得主指令
            .toLowerCase(); //轉成小寫

        switch (command) {
            case "help": {
                logfor(player, "======§b<§e指令清單§b>§r======\n§e-menu §a-取得玩家選單\n§e-admin_menu §a-取得管理員選單")
            }
            case "menu": {
                cmd(`give ${player.name} mcc:menu 1 0`);
                break;
            }
            case "admin_menu": {
                if (!player.hasTag("admin")) return logfor(player.name, '§c您沒有權限! 需要 "admin" Tag');
                cmd(`give ${player.name} mcc:admin_menu 1 0`);
                break;
            }
            case "testlevel": {
                levelTable.addScore(player, 1);
                break;
            }
            case "testexp": {
                expTable.addScore(player, 1);
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
    }
});

//當玩家加入
world.events.playerJoin.subscribe(eventData => {
    const player = eventData.player;

    if (player.nameTag.includes('"') || player.nameTag.length > 30) {
        kickPlayer2(player);
    }

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

    addXp(player, exp);
})

//物品使用
world.events.itemUse.subscribe(eventData => {

    let player = eventData.source;
    let item = eventData.item;

    if (item.id == "mcc:menu") PlayerMenu(player);
    else if (item.id == "mcc:admin_menu") AdminMenu(player);
});

//檢測擊殺生物
Minecraft.world.events.entityHit.subscribe(eventData => {
    const player = eventData.entity;
    const target = eventData.hitEntity;

    if (!target) return;

    const targetPos = target.location;
    const playerPos = player.location;
    const distance = Math.sqrt((targetPos.x - playerPos.x) ** 2 + (targetPos.y - playerPos.y) ** 2 + (targetPos.z - playerPos.z) ** 2);

    if (distance > 5 && !player.hasTag("admin") && antiCheatSetting.getData("aura")) {
        logfor("@a[tag=admin]", `>> §6${player.name}§c 攻擊距離異常(distance=${distance})`);
        if (antiCheatSetting.getData("kick")) kickPlayer(player);
    };

    let hp = target.getComponent("health");

    if (!hp) return;
    if (hp.current > 0) return;

    let exp = Math.round(Math.random() * baseXP * 5);
    addXp(player, exp);
})

world.events.tick.subscribe(() => {
    for (let player of world.getPlayers()) {

        if (player.location.x > 99999999 || player.location.y > 99999999 || player.location.z > 99999999 ) {
            logfor("@a[tag=admin]", `>> §6${player.name} §c嘗試使用Crasher崩圖`);
            cmd(`tp ${player.name} 0 -999 0`);
            if (antiCheatSetting.getData("kick")) kickPlayer(player);
        }

        let container = player.getComponent('inventory').container;
        for (let i = 0; i < container.size; i++) if (container.getItem(i)) {
            let item = container.getItem(i);
            if (item.amount > 64) clearItem(i)

            if(player.hasTag("admin")) continue;

            //TODO:item.nameTag 疑似取得不到，原因待釐清
            // if(item.nameTag.length > 32) clearItem(i)

            if (antiCheatSetting.getData("lore") && item.getLore().length) {
                logfor("@a[tag=admin]", `>> §6${player.name} §c持有非法物品(id=${item.id},lore=${item.getLore()})`)
                clearItem(player, i);
                if (antiCheatSetting.getData("kick")) kickPlayer(player);
                continue;
            }

            const banList = [
                "minecraft:beehive",
                "minecraft:bee_nest",
                "minecraft:moving_block",
            ];

            if (antiCheatSetting.getData("item") && banList.includes(item.id)) {
                logfor("@a[tag=admin]", `>> §6${player.name} §c持有非法物品(id=${item.id}})`)
                clearItem(player, i);
                if (antiCheatSetting.getData("kick")) kickPlayer(player);
                continue;
            }

            if (antiCheatSetting.getData("entity")) {
                rawcmd("kill @e[type=npc]");
                rawcmd("kill @e[type=bee]");
                rawcmd("kill @e[type=command_block_minecart]");
            }

            if (antiCheatSetting.getData("enchant")) {
                let itemEnchants = item.getComponent("enchantments").enchantments;
                for (let enchantment in Minecraft.MinecraftEnchantmentTypes) {
                    let enchantData = itemEnchants.getEnchantment(Minecraft.MinecraftEnchantmentTypes[enchantment]);

                    if (enchantData) {
                        if (enchantData.level > Minecraft.MinecraftEnchantmentTypes[enchantment].maxLevel || enchantData.level > 5) {
                            logfor("@a[tag=admin]", `>> §6${player.name}§c 物品附魔等級異常(id=${item.id},enchant=${enchantData.type.id},level=${enchantData.level})`);
                            clearItem(player, i);
                            if (antiCheatSetting.getData("kick")) kickPlayer(player);
                            continue;
                        }

                        let item2 = new Minecraft.ItemStack(Minecraft.MinecraftItemTypes[snakeToCamel(item.id)], 1, item.data);
                        if (!item2.getComponent("enchantments").enchantments.canAddEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantment], 1))) {
                            logfor("@a[tag=admin]", `>> §6${player.name}§c 附魔物品類型異常(id=${item.id},enchant=${enchantData.type.id},level=${enchantData.level})`);
                            clearItem(player, i);
                            if (antiCheatSetting.getData("kick")) kickPlayer(player);
                            continue;
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