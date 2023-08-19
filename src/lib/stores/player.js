import { writable } from 'svelte/store';

export const playerStore = writable(
    {
        ore: 0,
        monie: 0,
        pick_upgrades: 0,
        drills: 0
    }
);