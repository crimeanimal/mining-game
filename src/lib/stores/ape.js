import { writable } from 'svelte/store';

const startingPrice = 79456

function createApe() {
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
                change = n.price * 0.0006
                n.price += change
            } else if (random > 0.8) {
                change = n.price * 0.00048
                n.price += change
            } else if (random > 0.7) {
                change = n.price * 0.00036
                n.price += change
            } else if (random > 0.6) {
                change = n.price * 0.00024
                n.price += change
            } else if (random > 0.5) {
                change = n.price * 0.0012
                n.price += change
            } else if (random > 0.4) {
                change = n.price * 0.0005
                n.price -= change
            } else if (random > 0.3) {
                change = n.price * 0.0004
                n.price -= change
            } else if (random > 0.2) {
                change = n.price * 0.0003
                n.price -= change
            } else if (random > 0.1) {
                change = n.price * 0.0002
                n.price -= change
            } else {
                change = n.price * 0.001
                n.price -= change
            }
            n.priceHistory = [...n.priceHistory, n.price]
            return n
        })
    }
}

export const ape = createApe()