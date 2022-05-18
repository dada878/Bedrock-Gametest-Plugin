import * as scores from "./ScoresFormat.js"
import * as base64 from "./base64.js"
import { cmd, GetScores, log } from "./GameLibrary.js";
import { tableDB_cache, worldDB_table_cache } from "./cache.js";

/**
 * 表格資料庫系統
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
        return new WorldDB_Table(this.name, tableName);
    }
}

/**
 * 世界資料庫表格
 */
class WorldDB_Table {
    constructor(dbName, tableName) {
        this.dbName = dbName;
        this.tableName = tableName;

        worldDB_table_cache[`${dbName}:${tableName}`] = null;
        // this.cache = null;
        // setTickTimeout(()=>{log(`${tableName} obj created`);},400)
    }

    /**
     * 從表格中取得對應該鍵的內容
     * @param {string} key 鍵
     * @returns {number | string | Map | null} 取得到的資料，若無則回傳null
     */
    getData(key) {

        key = key.toLowerCase();

        //check cache
        if (worldDB_table_cache[`${this.dbName}:${this.tableName}`] != null) {
            return worldDB_table_cache[`${this.dbName}:${this.tableName}`][key];
        }

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
        worldDB_table_cache[`${this.dbName}:${this.tableName}`] = mapData;
        return result;
    }

    /**
     * 在表格中設定對應鍵的資料
     * @param {string} key 鍵
     * @param {number | string | Map | null} value 值(要設定的資料)
     */
    setData(key, value) {

        key = key.toLowerCase();

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
        worldDB_table_cache[`${this.dbName}:${this.tableName}`] = mapData;
    }

    /**
     * 取得表格內所有資料
     * @returns {Map<string,any>} 鍵對值的Map
     */
    getAllData() {

        //check cache
        // if (this.cache != null) {
        //     return this.cache;
        // }

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
        // this.cache = mapData;

        //main
        return mapData;
    }

    /**
     * 將指定資料項從表格內移除
     * @param {string} key 鍵
     */
    deleteData(key) {

        key = key.toLowerCase();

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

        key = key.toLowerCase();

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

        key = key.toLowerCase();

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

/**
 * 表格資料庫
 */
export class TableDB {
    constructor(dbName) {
        this.dbName = dbName;
        try { cmd(`scoreboard objectives add "${dbName}" dummy`); } catch { };
    }

    /**
     * 從表格中取得對應該鍵的內容
     * @param {string} key 鍵
     * @returns {number | string | Map | null} 取得到的資料，若無則回傳null
     */
    getData(key) {

        key = key.toLowerCase();

        //check cache
        if (tableDB_cache[`${this.dbName}:${key}`] != null) {
            return tableDB_cache[`${this.dbName}:${key}`];
        }

        //load
        const data = this.#getDataFromDB(key);

        let result;
        if (data == null) {
            result = null;
        } else {
            result = JSON.parse(data);
        }

        tableDB_cache[`${this.dbName}:${key}`] = result;
        return result;
    }

    /**
     * 在表格中設定對應鍵的資料
     * @param {string} key 鍵
     * @param {number | string | Map | null} value 值(要設定的資料)
     */
    setData(key, value) {

        key = key.toLowerCase();

        //save
        this.#setDataFromDB(key, JSON.stringify(value));
        tableDB_cache[`${this.dbName}:${key}`] = value;
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

/**
 * 純記分板資料庫系統
 */
export class ScoreboardDB {
    constructor(DB_Name, isPlayerScoreboard = false) {
        this.name = DB_Name;
        this.isPlayerScoreboard = isPlayerScoreboard;
        try { cmd(`scoreboard objectives add "${DB_Name}" dummy`); } catch { };
    }

    setScore(target, value) {
        if (this.isPlayerScoreboard) {
            if (target.name.includes(" ")) {
                cmd(`scoreboard players set "${target.name}" "${this.name}" ${value}`);
            } else {
                cmd(`scoreboard players set ${target.name} "${this.name}" ${value}`);
            }
        } else {
            cmd(`scoreboard players set "${target}" "${this.name}" ${value}`);
        }
    }

    addScore(target, value) {
        if (this.isPlayerScoreboard) {
            if (target.name.includes(" ")) {
                cmd(`scoreboard players add "${target.name}" "${this.name}" ${value}`);
            } else {
                cmd(`scoreboard players add ${target.name} "${this.name}" ${value}`);
            }
        } else {
            cmd(`scoreboard players add "${target}" "${this.name}" ${value}`);
        }
    }

    removeScore(target, value) {
        if (this.isPlayerScoreboard) {
            if (target.name.includes(" ")) {
                cmd(`scoreboard players remove "${target.name}" "${this.name}" ${value}`);
            } else {
                cmd(`scoreboard players remove ${target.name} "${this.name}" ${value}`);
            }
        } else {
            cmd(`scoreboard players remove "${target}" "${this.name}" ${value}`);
        }
    }

    getScore(target) {
        try {
            if (this.isPlayerScoreboard) {
                return GetScores(target.name, this.name);
            } else {
                return GetScores(target, this.name);
            }
        } catch (e) { return null }
    }
}