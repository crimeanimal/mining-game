import { writable } from 'svelte/store';

const startingPrice = 10

function createOre() {
    const { subscribe, set, update } = writable({
        price:startingPrice,
        priceHistory: [startingPrice]
    });
    return {
        subscribe,
        set,
        update
    }
}

export const ore = createOre()