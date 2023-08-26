import { writable } from 'svelte/store';

const startingPrice = 10
let up = 0
let down = 0

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
            let prevPrice = n.price
            if (random > 0.9) {
                change = n.price * 0.0012
                n.price += change
            } else if (random > 0.8) {
                change = n.price * 0.00096
                n.price += change
            } else if (random > 0.7) {
                change = n.price * 0.00072
                n.price += change
            } else if (random > 0.6) {
                change = n.price * 0.00048
                n.price += change
            } else if (random > 0.5) {
                change = n.price * 0.00024
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
                change = n.price * 0.0004
                n.price -= change
            } else {
                change = n.price * 0.0002
                n.price -= change
            }
            if (Math.sign(n.price - prevPrice) == -1) {
                down++
            } else {
                up++
            }
            console.log(`Random #: ${random} - ${n.price - prevPrice} - ${up} up vs ${down} down`)
            n.priceHistory = [...n.priceHistory, n.price]
            return n
        })
    }
}

export const ore = createOre()