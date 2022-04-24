import * as scores from "./ScoresFormat.js"
import * as base64 from "./base64.js"
import { cmd, GetScores } from "./GameLibrary.js";

export class WorldDB {
    constructor(name) {
        this.name = name;
        try { cmd(`scoreboard objectives add "${name}" dummy`); } catch { };
    }

    getData(key) {
        try {
            let result = "";

            for (let i in key) {
                const score = GetScores(`${base64.encode(key)}[${i}]`, this.name);
                result += scores.decode(score);
            }

            return result;
        } catch { return null }
    }

    setData(key, value) {
        for (let i in value) {
            cmd(`scoreboard players set "${base64.encode(key)}[${i}]" "${this.name}" ${scores.encode(value[i])}`)
        }
    }
}