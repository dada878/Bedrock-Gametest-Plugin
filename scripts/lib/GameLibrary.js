import * as Minecraft from 'mojang-minecraft';

export function cmd(command) {
    return Minecraft.world.getDimension("overworld").runCommand(command).statusMessage
};
export function rawcmd(command) {
    try {
        return { error: false, ...Minecraft.world.getDimension("overworld").runCommand(command) };
    }catch (error) {
        return { error: true };
    }
};
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