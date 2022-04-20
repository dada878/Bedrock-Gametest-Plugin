import { cmd, GetPlayerScoreboards, GetPlayerTags, log, logfor } from "../lib/GametestFunctions.js";

const tags_con = function(msg,player,SET_ISLIMIT,SET_CANHASTAGS,eventData,OpenNameTagCommand) {
    eventData.canceled = true
    if(!OpenNameTagCommand) {return "nope"}
    try {
        cmd(`scoreboard objectives add nametag dummy`)
    }
    catch (error) {}
    if (msg.startsWith("-helptag")) {cmd(`tellraw "${player.nameTag}" {"rawtext":[{"text":"-------------§a稱號指令§f-------------\n§e-addtag <稱號名稱> §b幫自己添加稱號\n§e-removetag <稱號名稱> §b幫自己刪除稱號\n§f----------------------------------"}]}`);return}
    if (msg.startsWith("-addtag")) {
        if (!GetPlayerTags(player.nameTag).includes("nametager") && SET_ISLIMIT) {logfor(player.nameTag,`§c你的權限無法使用該指令`);return}
        if (GetPlayerScoreboards(player.nameTag)["nametag"] >= SET_CANHASTAGS) {logfor(player.nameTag,`§c過多的稱號，每人最多擁有§e ${SET_CANHASTAGS} §c個稱號`);return}
        let nametag = msg.substring("-addtag".length+1,msg.length)
        try {
            cmd(`tag "${player.nameTag}" add api-tag-${nametag}`)
            logfor(player.nameTag,`§e添加稱號§b ${nametag} §e成功`);
            cmd(`scoreboard players add "${player.nameTag}" nametag 1`)
        }
        catch (error) {
            logfor(player.nameTag,"§c重複的稱號");
        }
    }
    else if (msg.startsWith("-removetag")) {
        if (!GetPlayerTags(player.nameTag).includes("mvp") && SET_ISLIMIT) {logfor(player.nameTag,`§c你的權限無法使用該指令`);return}
        let nametag = msg.substring("-removetag".length+1,msg.length)
        try {
            cmd(`tag "${player.nameTag}" remove api-tag-${nametag}`)
            logfor(player.nameTag,`§e刪除稱號§b ${nametag} §e成功`);
            cmd(`scoreboard players remove "${player.nameTag}" nametag 1`)
        }
        catch (error) {
            logfor(player.nameTag,"§c你沒有這個稱號");
        }
        cmd(`scoreboard players set @a[scores={nametag=..-1}] nametag 0`)
    }
    else {
        return "nope"
    }
}

export {tags_con}