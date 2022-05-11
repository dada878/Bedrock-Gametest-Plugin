import * as Minecraft from 'mojang-minecraft';


/**
 * 在主世界執行一段指令
 * @param {string} command 要執行的指令
 * @param {string} dimension opt - 執行維度
 * @returns {string} 指令執行結果
 */
export function cmd(command, dimension = "overworld") {
    return Minecraft.world.getDimension(dimension).runCommand(command).statusMessage
};


/**
 * 執行指令並回傳是否成功與結果
 * @param {string} command 要執行的指令
 * @returns {map} \{ error:bool, result:string \}
 */
export function rawcmd(command) {
    try {
        return { error: false, ...Minecraft.world.getDimension("overworld").runCommand(command) };
    } catch (error) {
        return { error: true };
    }
};


/**
 * 以玩家的身分(execute)執行陣列內的指令
 * @param {Minecraft.Player | string} player 玩家
 * @param {string[]} commands 需要執行的所有指令
 * @returns {boolean} 是否執行成功
 */
export function executeCmds(player, commands) {

    if (typeof player != typeof "string") {
        player = player.name;
    }

    const conditionalRegex = /^%/;
    if (conditionalRegex.test(commands[0])) return false;
    let error = false;
    commands.forEach(cmd => {
        if (error && conditionalRegex.test(cmd)) return false;
        error = rawcmd(`execute ${player} ~~~ ` + cmd.replace(conditionalRegex, '')).error;
    });
    return true;
}


/**
 * 執行陣列內所有指令
 * @param {string[]} commands 所有要執行的指令
 * @returns {boolean} 指令是否執行成功
 */
export function cmds(commands) {
    const conditionalRegex = /^%/;
    if (conditionalRegex.test(commands[0])) return false;
    let error = false;
    commands.forEach(cmd => {
        if (error && conditionalRegex.test(cmd)) return false;
        error = rawcmd(cmd.replace(conditionalRegex, '')).error;
    });
    return true;
}


/**
 * 傳送一則訊息給玩家
 * @param {Minecraft.Player | string} player 玩家
 * @param {string} message 訊息
 */
export function logfor(player, message) {
    try {
        if (typeof player != typeof "string") {
            player = player.name;
        }
        let okay_message = message.toString().replaceAll('\"', "''").replaceAll('\\', "/")
        if (player.includes("@")) {
            Minecraft.world.getDimension("overworld").runCommand(`tellraw ${player} {"rawtext":[{"text":"${okay_message}"}]}`)
        } else {
            Minecraft.world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text":"${okay_message}"}]}`)
        }
    } catch { }
};


/**
 * 傳送訊息給所有玩家
 * @param {string} message 訊息
 */
export function log(message) {
    let okay_message = `${message}`.replaceAll('\"', "''").replaceAll('\\', "/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"${okay_message}"}]}`)
}


/**
 * 取得某計分項在計分板內的值
 * @param {string} target 記分項目
 * @param {string} scoreboard 記分板
 * @returns {number} 執行成功回傳分數，失敗則為null
 */
export function GetScores(target, scoreboard) {
    try {
        const scoreMessage = cmd(`scoreboard players operation "${target}" "${scoreboard}" = "${target}" "${scoreboard}"`);
        const scoresRegEx = [...scoreMessage.matchAll(/\d+|-\d+/g)];
        const scores = scoresRegEx[scoresRegEx.length - 1];

        return Number(scores);

    } catch {
        return null;
    }
}

/**
 * 設定某計分項在計分板內的值
 * @param {string} target 計分項
 * @param {string} scoreboard 記分板
 * @param {number} scores 分數
 * @returns 
 */
export function SetScores(target, scoreboard, scores) {
    return cmd(`scoreboard players set "${target}" "${scoreboard}" ${scores}`);
}

/**
 * 增加某計分項在計分板內的值
 * @param {string} target 計分項
 * @param {string} scoreboard 記分板
 * @param {number} scores 分數
 * @returns 
 */
export function AddScores(target, scoreboard, scores) {
    return cmd(`scoreboard players set "${target}" "${scoreboard}" ${scores}`);
}

/**
 * 強制踢出玩家
 * @param {Minecraft.Player} player 
 */
export function kickPlayer2(player) {
    player.triggerEvent("kick");
}

/**
 * 踢出玩家
 * @param {Minecraft.Player} player 
 */
 export function kickPlayer(player) {
    cmd(`kick ${player.name}`);
}