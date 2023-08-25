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
            let random = Math.random()
            if (random > 0.9) {
                change = n.price * 0.006
                n.price += change
            } else if (random > 0.8) {
                change = n.price * 0.0048
                n.price += change
            } else if (random > 0.7) {
                change = n.price * 0.0036
                n.price += change
            } else if (random > 0.6) {
                change = n.price * 0.0024
                n.price += change
            } else if (random > 0.5) {
                change = n.price * 0.012
                n.price += change
            } else if (random > 0.4) {
                change = n.price * 0.005
                n.price -= change
            } else if (random > 0.3) {
                change = n.price * 0.004
                n.price -= change
            } else if (random > 0.2) {
                change = n.price * 0.003
                n.price -= change
            } else if (random > 0.1) {
                change = n.price * 0.002
                n.price -= change
            } else {
                change = n.price * 0.01
                n.price -= change
            }
            n.priceHistory = [...n.priceHistory, n.price]
            return n
        })
    }
}

export const ore = createOre()