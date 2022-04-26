import * as Minecraft from 'mojang-minecraft';


/**
 * 在主世界執行一段指令
 * @param {string} command 要執行的指令
 * @returns {string} 指令執行結果
 */
export function cmd(command) {
    return Minecraft.world.getDimension("overworld").runCommand(command).statusMessage
};


/**
 * 執行指令並回傳是否成功與結果
 * @param {string} command 要執行的指令
 * @returns {map} \{ error:bool, result:string \}
 */
export function rawcmd(command) {
    try {
        return { error: false, ...Minecraft.world.getDimension("overworld").runCommand(command) };
    }catch (error) {
        return { error: true };
    }
};


/**
 * 以玩家的身分(execute)執行陣列內的指令
 * @param {Minecraft.Player} player 玩家
 * @param {string[]} commands 需要執行的所有指令
 * @returns {boolean} 是否執行成功
 */
export function executeCmds(player,commands) {

    if (typeof player != typeof "string") {
        player = player.name;
    }

    const conditionalRegex = /^%/;
    if (conditionalRegex.test(commands[0])) return false;
    let error = false;
    commands.forEach(cmd => {
        if (error && conditionalRegex.test(cmd)) return false;
        error = rawcmd(`execute ${player} ~~~ `+cmd.replace(conditionalRegex, '')).error;
    });
    return true;
}


/**
 * 
 * @param {string[]} commands 所有要執行的指令
 * @returns 
 */
export function cmds(commands){
    const conditionalRegex = /^%/;
    if (conditionalRegex.test(commands[0])) return false;
    let error = false;
    commands.forEach(cmd => {
        if (error && conditionalRegex.test(cmd)) return false;
        error = rawcmd(cmd.replace(conditionalRegex, '')).error;
    });
    return true;
}
export function logfor(player,message) {
    if (typeof player != typeof "string") {
        player = player.name;
    }
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text":"${okay_message}"}]}`)
};
export function log(message) {
    let okay_message = `${message}`.replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"${okay_message}"}]}`)
}
export function GetScores (target, scoreboard) {
    try {
        const scoreMessage = cmd(`scoreboard players operation "${target}" "${scoreboard}" = "${target}" "${scoreboard}"`);
        const scoresRegEx = [...scoreMessage.matchAll(/\d+|-\d+/g)];
        const scores = scoresRegEx[scoresRegEx.length-1];
    
        return scores;

    } catch {
        return null;
    }
}
export function SetScores (target, scoreboard, scores) {
    return cmd(`scoreboard players set "${target}" "${scoreboard}" ${scores}`);
}