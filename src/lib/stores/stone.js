import { writable } from 'svelte/store';

export const stone = writable(
    {
        name: '',
        health: 0,
        difficulty: 20,
        reward: 0
    }
);