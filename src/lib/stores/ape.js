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
            if (Math.random() > 0.8) {
                change = n.price * 0.04
                n.price += change
            } else if (Math.random() > 0.5) {
                change = n.price * 0.012
                n.price += change
            } else if (Math.random() > 0.2) {
                change = n.price * 0.02
                n.price -= change
            } else if (Math.random() > 0) {
                change = n.price * 0.05
                n.price -= change
            } else {
                n.price = n.price
            }
            n.priceHistory = [...n.priceHistory, n.price]
            return n
        })
    }
}

export const ape = createApe()