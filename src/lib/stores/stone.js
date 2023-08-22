import { writable } from 'svelte/store';

export const stoneStore = writable(
    {
        name: '',
        health: 0,
        difficulty: 20,
        reward: 0
    }
);