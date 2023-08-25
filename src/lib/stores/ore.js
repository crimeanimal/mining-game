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
        update,
        changePrice: () => update((n) => {
            let change
            if (Math.random() > 0.5) {
                change = n.price * 0.12
                n.price += change
            } else {
                change = n.price * 0.1
                n.price -= change
            }
            n.priceHistory = [...n.priceHistory, n.price]
            return n
        })
    }
}

export const ore = createOre()