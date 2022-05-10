import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { pluginDB, minTranferLimit, maxTranferLimit } from "../config.js";
import { cmd, GetScores, log, logfor, SetScores, AddScores } from '../lib/GameLibrary.js';
import { WorldDB } from '../lib/WorldDB.js';

export const moneyTable = new WorldDB(luginDB.table("moneySetting").getData("scoreboard") ?? "money").raw();

export const buyableItems = [
    {
        displayName: '§7鐵錠',
        item: 'minecraft:iron_ingot',
        price: 300
    },
]
export const sellableItems = [
    {
        displayName: '§7鐵錠',
        item: 'minecraft:iron_ingot',
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
                let fm = new ui.ModalFormData();
                fm.title("購買");
                buyableItems.forEach((f) => {fm.button(f.displayName, f.icon ?? "")})

                fm.show(player).then(response => {
                    if (!response || response.isCanceled) return;

                    if(buyableItems[response.selection]){
                        const item = buyableItems[response.selection]
                        let money = moneyTable.getScore(player)
                        const maxCount = money / item.price
                        if(moneyTable.getScore(player) < item.price) return logfor(player, `>> 你沒有足夠的金錢買一個${item.displayName}!`)
                        let fm = new ui.ModalFormData();
                        fm.slider("你要買多少個？", 0, maxCount, 1, maxCount);

                        fm.show(player).then((response) => {console.warn(response)})
                    }
                })
            }
            case (1): {
                return; // TODO
            }
        }
    });
}