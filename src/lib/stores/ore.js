import { writable } from 'svelte/store';

export const oreTotalStore = writable(0);

export const oreStore = writable(10);

export const orePriceHistoryStore = writable([10,])