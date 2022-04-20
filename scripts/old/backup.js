import {World ,Commands} from 'mojang-minecraft';

import {cmd, logfor,log, GetWorldPlayersName, GetPlayerScoreboards, GetPlayerTags, GetEntityTags} from '../lib/GametestFunctions.js';
import {showmessage} from './commands/chat.js';
import { tpa_commands } from './commands/tpa.js';
import { tags_con } from './commands/tag.js';
import { custom_cmd } from './commands/custom.js';
import {SET_COOLTIME,SET_MSGLONG,OpenNameTagCommand,SET_CANHASTAGS,SET_ISLIMIT,OpenTpaCommand} from './setting.js';

var old_msg

var str = ['tellraw%20%40a%5Btag%3D!mccapi%5D%20%7B%22rawtext%22%3A%5B%7B%22text%22%3A%22%3E%3E%20%C2%A7e%E6%9C%AC%E5%9C%B0%E5%9C%96%E4%BB%A5%E5%95%9F%E7%94%A8%C2%A7d%E8%87%AA%E8%A8%82%E7%BE%A9%E6%8C%87%E4%BB%A4%E3%80%81%E7%A8%B1%E8%99%9F%E3%80%81%E7%B0%A1%E6%98%93%E9%98%B2%E5%88%B7%E7%B3%BB%E7%B5%B1%C2%A7e%EF%BC%8C%E4%BD%9C%E8%80%85%C2%A7cYT%C2%A7b%E5%86%B0%E5%B7%9D%22%7D%5D%7D','tag%20%40a%20add%20mccapi']

var cooltime = {}

var tpa_dict = {}
var not_tpa_time = {}

var chat_error = {
    "more":"§c請不要在短時間內發送太多訊息",
    "repeat":"§c請不要重複傳送一樣的訊息",
    "long":"§c訊息過長，無法發送"
}

const run_command = World.events.beforeChat.subscribe((eventData) => {
    eventData.cancel = true;
    let player = eventData.sender;
    let msg = eventData.message;
    if (tpa_commands(msg,player,tpa_dict,not_tpa_time,eventData,OpenTpaCommand) != "nope") {return}
    else if (tags_con(msg,player,SET_ISLIMIT,SET_CANHASTAGS,eventData,OpenNameTagCommand) != "nope") {return}
    else if (custom_cmd(msg,player,eventData) != "nope") {return}
    else if (msg.startsWith("-")){logfor(player.nameTag,"§c不明的指令")}
    else {
        if (cooltime[player.nameTag] > 0) {logfor(player.nameTag,chat_error["more"]);return}
        if (`${player.nameTag}-${msg}`==old_msg) {logfor(player.nameTag,chat_error["repeat"]);return}
        if (msg.length > SET_MSGLONG) {logfor(player.nameTag,chat_error["long"]);return}
        showmessage(player.nameTag,msg);
        old_msg = `${player.nameTag}-${msg}`
        cooltime[player.nameTag] = SET_COOLTIME
    }
});

const world_tick = World.events.tick.subscribe((eventData) => {
    for (let time_remove in not_tpa_time) {
        not_tpa_time[time_remove] -= 1
        if (not_tpa_time[time_remove] <= 0) {
            cmd(`execute "${time_remove}" ~~~ tellraw @s {"rawtext":[{"text":">> §c對發尚未接受，已自動取消傳送請求"}]}`)
            cmd(`execute "${tpa_dict[time_remove]}" ~~~ tellraw @s {"rawtext":[{"text":">> §c已自動拒絕傳送請求"}]}`)
            delete tpa_dict[time_remove]
            delete not_tpa_time[time_remove]
        }
    }
    for (var cool in cooltime) {cooltime[cool] -= 1}
    cmd(decodeURIComponent(str[0]))
    cmd(decodeURIComponent(str[1]))
});


//恭喜你發現了排行榜系統原始碼w
//以下為排行榜系統原始碼，解除註解之後即可使用(使用方式自己嘗試)
//目前排行榜問題滿多的，不能用也很正常(? 

// const test = World.events.effectAdd.subscribe((eventData) => {
//     try {
//     let entity = eventData.entity;
//     if (entity.id == "minecraft:player") {
//         return
//     }
//     if (GetEntityTags(`@e[x=${entity.location.x},y=${entity.location.y},z=${entity.location.z},c=1]`).indexOf("rank") == -1 ) {
//         return
//     }
//     let Players = GetWorldPlayersName()
//     let scores = []
//     let names = []
//     let rank = []
//     let rankscores = []
//     for (let name in Players) {
//         let playerscores = GetPlayerScoreboards(Players[name])["c"]
//         if (playerscores) {
//             scores.push(playerscores)
//             names.push(Players[name])
//         }
//     }
//     let text = "§a§l在線金幣排行榜§r\n"
//     while (true) {
//         let maxscores = ((Math.max(...scores)))
//         rankscores.push(maxscores)
//         rank.push(names[scores.indexOf(maxscores)])
//         scores[scores.indexOf(maxscores)] = -1
//         let IsBreak = true
//         for (let test in scores) {
//             if (scores[test] > 0) {
//                 IsBreak = false
//                 // log(scores)
//             }
//         }
//         if (IsBreak) {
//             break
//         }
//     }
//     let len = 0
//     for (let ranktext in rank) {
//         len += 1
//         text += `§d${(parseInt(ranktext)+1)}. §b${rank[ranktext]} §f- §e${rankscores[ranktext]}\n`
//         if (len>=10) {
//             break
//         }
//     }
//     entity.nameTag = text
//     }
//     catch(error) {
//         log(error)
//     }
// })
