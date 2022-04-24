import * as scores from "./ScoresFormat.js"
import * as base64 from "./base64.js"
import { cmd, GetScores, log } from "./GameLibrary.js";

export class WorldDB {
    constructor(name) {
        this.name = name;
        try { cmd(`scoreboard objectives add "${name}" dummy`); } catch { };
    }

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
}