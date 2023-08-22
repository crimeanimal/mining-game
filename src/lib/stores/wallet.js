import { writable } from 'svelte/store';

export const walletStore = writable({connected: false});