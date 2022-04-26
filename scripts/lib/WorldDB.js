import * as scores from "./ScoresFormat.js"
import * as base64 from "./base64.js"
import { cmd, GetScores } from "./GameLibrary.js";

/**
 * 世界資料庫系統
 */
export class WorldDB {
    /**
     * 初始化世界資料庫
     * @param {string} name 資料庫名稱
     */
    constructor(name) {
        this.name = name;
        try { cmd(`scoreboard objectives add "${name}" dummy`); } catch { };
    }

    /**
     * 取得世界資料庫中的資料
     * @param {string} key 鍵
     * @returns 若該鍵存在就回傳對應值，不存在則回傳null
     */
    getData(key) {
        let result = "";
        try {
            let i = 0;
            while (true) {
                const score = GetScores(`${base64.encode(`${key}[${i}]`)}`, this.name);
                result += scores.decode(score.toString());
                i++;
            }
        } catch (e) {
            if (result == "" || result == null) {
                return null;
            } else {
                return result;
            }
        }
    }

    checkData(key) {
        const dataName = `${base64.encode(`${key}[${i}]`)}`;
        cmd(`scoreboard players operation "${dataName}" "${this.name}" = "${dataName}" "${this.name}"`)
    }

    /**
     * 設定世界資料庫內的資料
     * @param {string} key 鍵
     * @param {string} value 值
     */
    setData(key, value) {
        value = `${value}`;
        let i = 0;
        for (let j in value) {
            const dataName = `${base64.encode(`${key}[${i}]`)}`;
            cmd(`scoreboard players set "${dataName}" "${this.name}" ${scores.encode(value[i])}`);
            i++;
        }
        while (true) {
            try {
                const dataName = `${base64.encode(`${key}[${i}]`)}`;
                cmd(`scoreboard players reset "${dataName}" "${this.name}"`)
                i++;
            } catch { break }
        }
    }

    /**
     * 取得純分數資料
     * @param {string} key 鍵
     * @returns {number} 取得到的資料
     */
    getRawData(key) {
        if (typeof key != typeof "string") {
            key = key.name;
        }

        const dataName = key

        return Number(GetScores(dataName, this.name));
    }

    /**
     * 設定純分數資料
     * @param {string} key 鍵
     * @param {number} value 值
     */
    setRawData(key, value) {
        if (typeof key != typeof "string") {
            key = key.name;
        }

        cmd(`scoreboard players set ${key} ${this.name} ${value}`);
    }

    /**
    * 對純分數資料添加數值
    * (例如添加角色經驗值)
    * @param {string} key 鍵
    * @param {number} value 要添加的數值
    */
    addRawData(key, value) {
        if (typeof key != typeof "string") {
            key = key.name;
        }

        cmd(`scoreboard players add ${key} ${this.name} ${value}`);
    }
}