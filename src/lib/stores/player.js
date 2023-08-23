import { writable } from 'svelte/store';

export const player = writable(
    {
        level: 1,
        damage: 1,
        xpPerLevel: 100,
        xp: 0,
        ore: 0,
        apes: 0,
        monie: 0,
        pick_upgrades: 0,
        drills: 0,
        drill_damage: 1,
        dogs: 0
    }
);