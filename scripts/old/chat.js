import { log, cmd, GetPlayerTags } from '../lib/GametestFunctions.js';


function showmessage(sender,message) {
    let playertags = GetPlayerTags(sender)
    let playertagslist = ""
    for (let tag in playertags) {
        if (playertags[tag].startsWith("api-tag-")){
            let tagtitlename = (playertags[tag].replaceAll("api-tag-",""))
            if (tagtitlename.startsWith("§")) {
                playertagslist += "§"+ tagtitlename[1] +"["+ tagtitlename + "]§r"
            }
            else {
                playertagslist += "§r["+ tagtitlename + "§r]"
            }
        }
    }
    if (playertags.indexOf("admin") != -1) {log(`§c[管理員]§r${playertagslist}${sender} §r>>§6 ${message}`)}
    else if (playertags.indexOf("vip") != -1) {log(`§b[會員玩家]§r${playertagslist}${sender} §r>>§a ${message}`)}
    else if (playertags.indexOf("mvp") != -1) {log(`§c[§6超§e級§a會§b員§d]§r${playertagslist}${sender} §r>>§e ${message}`)}
    else {log(`§e[玩家]§r${playertagslist}${sender} §r>> ${message}`)}
}

export {showmessage};