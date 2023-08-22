import { writable } from 'svelte/store';

export const settingsStore = writable(
    {
        sounds: true,
        music: true,
    }
);