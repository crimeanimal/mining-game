import { writable } from 'svelte/store';

export const settings = writable(
    {
        sounds: true,
        music: true,
    }
);