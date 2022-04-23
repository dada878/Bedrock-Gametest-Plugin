import * as Minecraft from 'mojang-minecraft';

export function cmd(command) {
    return Minecraft.world.getDimension("overworld").runCommand(command).statusMessage
};
  
export function logfor(player,message) {
    if (typeof player != typeof "string") {
        player = player.name;
    }
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text":"${okay_message}"}]}`)
};

export function log(message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"${okay_message}"}]}`).statusMessage
}

export function GetScores (target, scoreboard) {
    try {
        const scoreMessage = cmd(`scoreboard players operation "${target}" "${scoreboard}" = "${target}" "${scoreboard}"`);
        const scoresRegEx = [...scoreMessage.matchAll(/\d+/g)];
        const scores = scoresRegEx[scoresRegEx.length-1];
    
        return scores;

    } catch {
        return null;
    }
}
export function SetScores (target, scoreboard, scores) {
    return cmd(`scoreboard players set "${target}" "${scoreboard}" ${scores}`);
}

/*
GetPlayerScoreboards(playername) 回傳玩家所有記分板的字典
GetPlayerTags(playername) 回傳玩家所有標籤的陣列
cmd(command) 執行指令並回傳執行訊息
log(messgae) 傳送給所有玩家titleraw訊息
logfor(playername,messgae) 傳送給指定玩家titleraw訊息
PosX(PlayerClass) 回傳處理過後的玩家X座標
PosY(PlayerClass) 回傳處理過後的玩家Y座標
PosZ(PlayerClass) 回傳處理過後的玩家Z座標
*/