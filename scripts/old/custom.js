import { cmd, GetPlayerScoreboards, GetPlayerTags, log, logfor } from "../lib/GametestFunctions.js";

//自定義指令
var CustomCommands = {
    'hub':['tp @s 0.5 5 -0.5','tellraw @s {"rawtext":[{"text":">> §e已經您傳送到 §b大聽"}]}'],
    'help':['tellraw @s {"rawtext":[{"text":"-------------§a指令列表§f-------------\n§e-hub §b返回大廳\n§e-shop §b前往商店\n§e-mine §b前往礦場\n§e-mine2 §b前往礦場2\n§e-addtag <稱號> §b添加自訂義稱號\n§e-removetag <稱號> §b移除自訂義稱號\n§f----------------------------------"}]}']
}

const custom_cmd = function(msg,player,eventData) {
    if(!Object.keys(CustomCommands).length) {return "nope"}
    let CanRunCmd = false
    for (let custom in CustomCommands) {
        if (msg.toLowerCase().trim() == ("-"+custom)) {
            CanRunCmd = true
            eventData.canceled = true
            for (let command in CustomCommands[custom]) {
                try {cmd(`execute "${player.nameTag}" ~~~ ${CustomCommands[custom][command]}`)}
                catch(error) {}
            }
        }
    }
    if (!CanRunCmd) {return "nope"}
}

export {custom_cmd}