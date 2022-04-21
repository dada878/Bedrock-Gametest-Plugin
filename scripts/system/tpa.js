import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, GetWorldPlayersName, log, logfor } from '../lib/GametestFunctions.js';

function TpaSystem(player) {
    let fm = new ui.ModalFormData();
    let players = world.getPlayers();

    let operations = [];
    let playerObjects = [];

    for (let player of players) {
        operations.push(player.name);
        playerObjects.push(player);
    }

    fm.title("玩家互傳系統");
    fm.dropdown("選擇玩家", operations);
    fm.toggle("請求對方傳送到你這裡");
    fm.show(player).then(response => {
        let fm = new ui.MessageFormData();
        let target = playerObjects[response.formValues[0]];
        let tpHere = response.formValues[1];
        if (tpHere) {
            fm.body(`${player.name} 希望把你傳送到他那裡`);
        } else {
            fm.body(`${player.name} 想要傳送來你這裡`);
        }
        fm.button1(`接受`);
        fm.button2(`拒絕`);
        logfor(player, `>> §e已對 ${target.name} 送出傳送請求`)
        fm.show(target).then(response => {
            if (response.selection != 1) return logfor(player, ">> §c請求已被拒絕");
            logfor(player, ">> §a對方接受了傳送請求")
            if (tpHere) {
                cmd(`tp "${target.name}" "${player.name}"`);

            } else {
                cmd(`tp "${player.name}" "${target.name}"`);
            }
        })
    })
    
}

export {TpaSystem};