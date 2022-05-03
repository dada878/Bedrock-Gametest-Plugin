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