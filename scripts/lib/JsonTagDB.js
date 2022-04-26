import * as Minecraft from 'mojang-minecraft';


/**
 * 取得玩家的JsonTagDB資料
 * @param {Minecraft.Player} player 玩家
 * @param {string} key 用於存取資料的鍵
 * @returns {string} 取得到的資料，若無則回傳null
 */
export function getData(player,key) {
    let db = checkDB(player);
    if (db["tagDB"][key] == undefined) db["tagDB"][key] = null;
    return db["tagDB"][key];
}


/**
 * 設定玩家的JsonTagDB資料
 * @param {Minecraft.Player} player 玩家
 * @param {string} key 儲存資料的鍵
 * @param {string} value 要儲存的資料
 */
export function setData(player,key,value) {
    let db = checkDB(player);
    player.removeTag(JSON.stringify(db));
    db["tagDB"][key] = value;
    player.addTag(JSON.stringify(db));
}


/**
 * 檢查資料庫是否存在，若無則創建空資料庫
 * @param {Minecraft.Player} player 玩家
 * @returns {Map} 回傳Json(Map)資料庫
 */
function checkDB(player) {
    const tags = player.getTags();

    let found = false;
    let DB;

    for (let i in tags) {
        if (tags[i].startsWith('{"tagDB":{')) {
            DB = JSON.parse(tags[i]);
            found = true;
        }
    }

    if (found) return DB;

    DB = {"tagDB":{}};
    player.addTag(JSON.stringify(DB));

    return DB;
}