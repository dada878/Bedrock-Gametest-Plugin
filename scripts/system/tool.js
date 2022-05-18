import * as Minecraft from 'mojang-minecraft';
import { ScoreboardDB } from '../lib/WorldDB';

const cpsDB = new ScoreboardDB("cps", true);
let playerCPS = {};
let CpsCache = {};

Minecraft.world.events.entityHit.subscribe(eventData => {
    const player = eventData.entity;
    const target = eventData.hitEntity;

    if (!target) return;

    let cps = playerCPS[player.name] ?? 0;
    cps++;
    playerCPS[player.name] = cps;
})

let tick = 0;
Minecraft.world.events.tick.subscribe(eventData => {
    tick ++;

    for (let player of Minecraft.world.getPlayers()) {
        const playerName = player.name;

        let cps = playerCPS[player.name] ?? 0;
        const cache = CpsCache[playerName] ?? 0;
        if (cache > cps) {
            cps = cache - 1;
        }

        CpsCache[playerName] = cps;

        cpsDB.setScore(player, cps);
    }

    if (tick % 20 > 0) return;
    playerCPS = {};
})