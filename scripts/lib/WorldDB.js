import * as scores from "./ScoresFormat.js"
import * as base64 from "./base64.js"
import { cmd, GetScores, log } from "./GameLibrary.js";

/**
 * 世界資料庫系統
 */
export class WorldDB {
    /**
     * 建立一個世界資料庫
     * @param {string} name 資料庫名稱
     */
    constructor(name) {
        this.name = name;
        try { cmd(`scoreboard objectives add "${name}" dummy`); } catch { };
    }
    /**
     * 在資料世界庫使用一個表格
     * @param {string} tableName 表格名稱 
     * @returns 創建/取得到的表格
     */
    table(tableName) {
        return new DBTable(this.name, tableName);
    }
    /**
     * 在資料世界庫使用一個分數處理器
     * @param {string} tableName 表格名稱 
     * @returns 創建/取得到的表格
     */
    raw() {
        return new RawTable(this.name);
    }
}

/**
 * 世界資料庫表格
 */
class DBTable {
    constructor(dbName, tableName) {
        this.dbName = dbName;
        this.tableName = tableName;
    }

    /**
     * 從表格中取得對應該鍵的內容
     * @param {string} key 鍵
     * @returns {number | string | Map | null} 取得到的資料，若無則回傳null
     */
    getData(key) {
        //load
        const tableData = this.#getDataFromDB(this.tableName);
        let mapData;
        if (tableData == null) {
            mapData = {};
        } else {
            mapData = JSON.parse(tableData);
        }
        //save
        this.#setDataFromDB(this.tableName, JSON.stringify(mapData));
        //main
        const result = mapData[key] ?? null;
        return result;
    }

    /**
     * 在表格中設定對應鍵的資料
     * @param {string} key 鍵
     * @param {number | string | Map | null} value 值(要設定的資料)
     */
    setData(key, value) {
        //load
        const tableData = this.#getDataFromDB(this.tableName);
        let mapData;
        if (tableData == null) {
            mapData = {};
        } else {
            mapData = JSON.parse(tableData);
        }
        //main
        mapData[key] = value;
        //save
        this.#setDataFromDB(this.tableName, JSON.stringify(mapData));
    }

    /**
     * 取得表格內所有資料
     * @returns {Map<string,any>} 鍵對值的Map
     */
    getAllData() {
        //load
        const tableData = this.#getDataFromDB(this.tableName);
        let mapData;
        if (tableData == null) {
            mapData = {};
        } else {
            mapData = JSON.parse(tableData);
        }
        //save
        this.#setDataFromDB(this.tableName, JSON.stringify(mapData));
        //main
        return mapData;
    }

    /**
     * 將指定資料項從表格內移除
     * @param {string} key 鍵
     */
    deleteData(key) {
        //load
        const tableData = this.#getDataFromDB(this.tableName);
        let mapData;
        if (tableData == null) {
            mapData = {};
        } else {
            mapData = JSON.parse(tableData);
        }
        //main
        delete mapData[key];
        //save
        this.#setDataFromDB(this.tableName, JSON.stringify(mapData));
    }

    #getDataFromDB(key) {
        let result = "";
        try {
            let i = 0;
            while (true) {
                const score = GetScores(`${base64.encode(`${key}[${i}]`)}`, this.dbName);
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

    #setDataFromDB(key, value) {
        value = `${value}`;
        let i = 0;
        for (let j in value) {
            const dataName = `${base64.encode(`${key}[${i}]`)}`;
            cmd(`scoreboard players set "${dataName}" "${this.dbName}" ${scores.encode(value[i])}`);
            i++;
        }
        while (true) {
            try {
                const dataName = `${base64.encode(`${key}[${i}]`)}`;
                cmd(`scoreboard players reset "${dataName}" "${this.dbName}"`)
                i++;
            } catch { break }
        }
    }
}

class RawTable {
    constructor(DB_Name) {
        this.name = DB_Name;
    }

    setScore(target, value) {
        cmd(`scoreboard players set "${target}" "${this.name}" ${value}`);
    }

    addScore(target, value) {
        cmd(`scoreboard players add "${target}" "${this.name}" ${value}`);
    }

    removeScore(target, value) {
        cmd(`scoreboard players remove "${target}" "${this.name}" ${value}`);
    }

    getScore(target) {
        return GetScores(target, this.name);
    }
}