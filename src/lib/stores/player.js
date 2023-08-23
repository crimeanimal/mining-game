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
        drills: {
            amount: 0,
            damage: 1
        },
        dogs: {
            amount: 0,
            treats: 0
        }
    }
);