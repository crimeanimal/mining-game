import { writable } from 'svelte/store';

export const apePriceStore = writable(79456);

export const apePriceHistoryStore = writable([79456,])