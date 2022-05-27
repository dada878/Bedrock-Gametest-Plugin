import { WorldDB } from "./lib/WorldDB";

/**
 * @readonly
 * @description 命令的觸發符
 */
export const prefix = "-";

/**
 * @readonly
 * @description 預設的玩家稱號
 */
export const default_title = "§a玩家";

/**
 * @readonly
 * @description 給予的經驗範圍
 */
export const baseXP = 5;

/**
 * @readonly
 * @description 升級的factor, formula為 level^2*factor
 */
export const levelFactor = 5;

/**
 * @description 聊天格式 %level% = 玩家等級, %title% = 稱號, %player% = 玩家名字, %content% = 内容
 */
export const chatFormat = `[§bLv.%level%§r][%title%§r]%player% §7>>§f %content%`

/**
 * @readonly
 * @description 檢查物品簡介
 */ 
export const checkLore = true

/**
 * @readonly
 * @description 檢查違法附魔
 */
export const checkEnchantment = true

/**
 * @readonly
 * @description 簽到獎勵
 */
export const signinReward = 599

/**
 * @readonly
 * @description Name Checking
 */
export const nameCheckRegex = /[^A-Za-z0-9_]/gm

/**
 * @readonly
 * @description Swear checking
 */
 expor
export const swearCheck = /[NnFf][IiAa]g?(g)(.{0,})/gm

export const pluginDB = new WorldDB("plugin_database");
export const enables = pluginDB.table("enable");
