import { writable } from 'svelte/store';

export const ape = writable({
    price: 79456,
    priceHistory: [79456,]
});