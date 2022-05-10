import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { pluginDB } from "../config.js";
import { cmd, log, logfor, cmds, strify } from '../lib/GameLibrary.js';
import { WorldDB } from '../lib/WorldDB.js';

export const maxSelect = 128
export const moneyTable = new WorldDB(pluginDB.table("moneySetting").getData("scoreboard") ?? "money").raw();

export const buyableItems = [
    {
        display: '§7鐵錠',
        id: 'minecraft:iron_ingot',
        price: 300
    },
    {
        display: '§b鑽石',
        id: 'minecraft:diamond',
        price: 500
    },
    {
        display: '§a綠寶石',
        id: 'minecraft:emerald',
        price: 750
    },
    {
        display: '§d下屆合金',
        id: 'minecraft:netherite_ingot',
        price: 1000
    },
]
export const sellableItems = [
    {
        display: '§7鐵錠',
        id: 'minecraft:iron_ingot',
        price: 250
    },
]
export function ShopSystem(player) {
    let fm = new ui.ActionFormData();
    fm.title("noone");
    fm.body("noone");
    fm.button('§l§1購買');
    fm.button('§l§1出售');

    fm.show(player).then(response => {
        if (!response || response.isCanceled) { return }
        
        switch(response.selection){
            case (0): {
                let fm = new ui.ActionFormData();
                fm.title("購買");
                buyableItems.forEach((f) => {fm.button(f.display, f.icon ?? "")})

                fm.show(player).then(response => {
                    if (!response || response.isCanceled) return;

                    if(buyableItems[response.selection]){
                        const item = buyableItems[response.selection]
                        let money = moneyTable.getScore(player)
                        const maxCount = money / item.price
                        if(moneyTable.getScore(player) < item.price) return logfor(player, `>> 你沒有足夠的金錢買一個${item.display}!`)
                        let fm = new ui.ModalFormData();
                        fm.slider("你要買多少個？", 0, maxCount > maxSelect ? maxSelect : maxCount, 1, maxCount);

                        fm.show(player).then((response) => {
                            let count = response.formValues[0] 
                            cmds([
                                `give ${player.name} ${item.id} ${response.formValues[0]} `
                            ])
                            logfor(player, `>> 成功購買${count}個${item.display}!`)
                            moneyTable.removeScore(player, count * item.price)
                        })
                    }
                })
            }
            case (1): {
                return; // TODO
            }
        }
    });
}