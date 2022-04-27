import { WorldDB } from "./lib/WorldDB";

export const prefix = "-";
export const default_title = "§a玩家";
export const baseXP = 100;
export const levelFactor = 5;
export const chatFormat = `[§bLv.%level%§r][%title%§r]%player% §7>>§f %content%` //這裏的數據都是未來設定可更改的



//database
export const pluginDB = new WorldDB("plugin_database");
export const enables = pluginDB.table("enable");;