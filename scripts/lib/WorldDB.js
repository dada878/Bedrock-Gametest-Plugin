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
            while(true) {
                const score = GetScores(`${base64.encode(key)}[${i}]`, this.name);
                result += scores.decode(score);
                i++;
            }
        } catch {return result;}
    }

    setData(key, value) {
        value = value.toString();
        for (let i in value) {
            cmd(`scoreboard players set "${base64.encode(key)}[${i}]" "${this.name}" ${scores.encode(value[i])}`)
        }
    }
}