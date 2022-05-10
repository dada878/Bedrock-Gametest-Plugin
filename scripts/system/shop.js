import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { pluginDB } from "../config.js";
import { cmd, log, logfor, cmds, strify } from '../lib/GameLibrary.js';
import { WorldDB } from '../lib/WorldDB.js';

export const moneyTable = new WorldDB(pluginDB.table("moneySetting").getData("scoreboard") ?? "money").raw();

export const buyableItems = [
    {
        display: '§7鐵錠',
        id: 'minecraft:iron_ingot',
        price: 300
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
                        if(moneyTable.getScore(strify(player.name)) < item.price) return logfor(player, `>> 你沒有足夠的金錢買一個${item.display}!`)
                        let fm = new ui.ModalFormData();
                        fm.slider("你要買多少個？", 0, maxCount, 1, maxCount);

                        fm.show(player).then((response) => {
                            cmds([
                                `give ${player.name} ${item.id} ${response.formValues[0]} `
                            ])
                            logfor(player, `>> 成功購買${response.formValues[0]}個${item.display}!`)
                            moneyTable.removeScore(strify(player.name), response.formValues[0] * price)
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