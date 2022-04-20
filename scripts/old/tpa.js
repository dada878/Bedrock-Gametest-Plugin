import { cmd, log , logfor} from "../lib/GametestFunctions.js"

const tpa_commands = function(msg,player,tpa_dict,not_tpa_time,eventData,OpenTpaCommand) {
    eventData.canceled = true
    if (!OpenTpaCommand) {return "nope"}
    try {
    if (msg.substring(0,4) == "-tpa") {
        let target = msg.substring(5,msg.length)
        cmd(`execute "${target}" ~~~ tellraw "${player.nameTag}" {"rawtext":[{"text":">> §e已發送傳送請求給 §b${target}"}]}`)
        cmd(`execute "${target}" ~~~ tellraw @s {"rawtext":[{"text":">> §b${player.nameTag}§r §e想傳送過來，使用-tpyes接受，-tpno拒絕"}]}`)
        not_tpa_time[player.nameTag] = 600;
        tpa_dict[player.nameTag] = target
    }
    else if (msg == "-tpyes") {
        for (let tpa_key in tpa_dict) { // tpa_dict[tpa_key] = 目標 | tpa_key = 玩家
            if (tpa_dict[tpa_key].toUpperCase() == player.nameTag.toUpperCase()) {
                cmd(`execute "${tpa_key}" ~~~ tp @s "${tpa_dict[tpa_key]}"`)
                cmd(`execute "${tpa_dict[tpa_key]}" ~~~ playsound random.orb`)
                cmd(`execute "${tpa_key}" ~~~ playsound random.orb`)
                cmd(`execute "${tpa_dict[tpa_key]}" ~~~ tellraw @s {"rawtext":[{"text":">> §a傳送成功"}]}`)
                cmd(`execute "${tpa_key}" ~~~ tellraw @s {"rawtext":[{"text":">> §a傳送成功"}]}`)
                delete not_tpa_time[tpa_key]
                delete tpa_dict[tpa_key]
            }
        }

    }
    else if (msg == "-tpno") {
        for (let tpa_key in tpa_dict) { // tpa_dict[tpa_key] = 目標 | tpa_key = 玩家
            if (tpa_dict[tpa_key].toUpperCase() == player.nameTag.toUpperCase()) {
                cmd(`execute "${tpa_dict[tpa_key]}" ~~~ playsound note.pling`)
                cmd(`execute "${tpa_key}" ~~~ playsound note.pling`)
                cmd(`execute "${tpa_dict[tpa_key]}" ~~~ tellraw @s {"rawtext":[{"text":">> §c已拒絕傳送請求"}]}`)
                cmd(`execute "${tpa_key}" ~~~ tellraw @s {"rawtext":[{"text":">> §c你的傳送請求被拒絕了"}]}`)
                delete not_tpa_time[tpa_key]
                delete tpa_dict[tpa_key]
            }
        }
    }
    else {return "nope"}
    }
    catch (error) {
        logfor(player.nameTag,"§c找不到該玩家，請確認是否有輸入錯誤")
    }
}

export{tpa_commands}