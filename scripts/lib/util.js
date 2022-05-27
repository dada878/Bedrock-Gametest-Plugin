import {rawcmd} from "./GameLibrary.js"
// thanks https://stackoverflow.com/a/52551910 and https://stackoverflow.com/a/7224605
/**
 * @name snakeToCamel
 * @param {string} str - The string to convert
 * @example str("minecraft:enchanted_golden_apple");
 * @remarks Converts a snake_case string to camelCase
 * @returns {string} str - The converted string
 */
export function snakeToCamel(str) {
    str = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace("minecraft", "");

    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function clearItem(player, slot){
    slot = slot + 0;

    if (slot >= 0) {
        try {
            if(slot <= 8) player.runCommand(`replaceitem entity @s slot.hotbar ${slot} air 1`);
                else player.runCommand(`replaceitem entity @s slot.inventory ${slot - 9} air 1`);
        } catch(error) { }
    }
}

export function getItemCount(player, id, data) { //from WrapperCord, thanks!
    let itemCount = [];
    const dat = cmd(`clear "${player}" ${id} ${data ? data : '0'} 0`);
    if (dat.error)
        return itemCount;
    dat.forEach(element => {
        const count = parseInt(element.match(/(?<=.*?\().+?(?=\))/)[0]);
        const player = element.match(/^.*(?= \(\d+\))/)[0];
        itemCount.push({ player, count });
    });
    return itemCount ? itemCount : [];
}