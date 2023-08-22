import { writable } from 'svelte/store';

export const ore = writable({
    price:10,
    priceHistory: [10]
});