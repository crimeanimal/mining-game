import { get, writable } from 'svelte/store';
import { messages } from './message';
import { ore } from './ore';
import { formatter } from '$lib/formatter';
import { ape } from './ape';



/**
 * @type number
 */
let oreValue
ore.subscribe((currentOre) => {
    oreValue = currentOre.price
})

/**
 * @type number
 */
let apeValue
ape.subscribe((currentApe) => {
    apeValue = currentApe.price
})

function createPlayer() {
    const { subscribe, set, update } = writable(
        {
            level: 1,
            xpPerLevel: 100,
            xp: 0,
            ore: 0,
            apes: 0,
            monie: 0,
            picks: {
                amount: 1,
                damage: 1,
                upgrades: 0,
                total_damage: function () {return this.damage+(this.upgrades * 0.1)},
            },
            drills: {
                amount: 0,
                damage: 1,
                total_damage: function () {return (this.damage * this.amount)}
            },
            dogs: {
                amount: 0,
                treats: 0,
                total_sells: function () {
                    if (this.treats == 0) {
                        return this.amount
                    } else if (this.treats > 0) {
                        return this.amount * (Math.pow(this.treats,2))
                    }
                },
                waters: 0
            }
        }
    )
    return {
        subscribe,
        set,
        update,
        levelUp: () => update((n) => {
            n.level += 1
            n.xp = n.xp - n.xpPerLevel
            n.xpPerLevel += (n.xpPerLevel * 0.1)
            return n
        }),
        transact: {
            ore: (/** @type {string} */ side,/** @type {number} */ amount) => update((n) => {
                if (side == 'BUY') {
                    n.monie -= (oreValue * amount)
                    n.ore += amount
                } else if (side == 'SELL') {
                    n.ore -= amount
                    n.monie += (oreValue * amount)
                }
                messages.newMessage('ORE', side + ' ' + amount + ' ore at ' + formatter.currency(oreValue) + ' for a total of ' + formatter.currency((amount*oreValue)))
                return n
            }),
            apes: (/** @type {string} */ side,/** @type {number} */ amount) => update((n) => {
                if (side == 'BUY') {
                    n.monie -= (apeValue * amount)
                    n.apes += amount
                } else if (side == 'SELL') {
                    n.apes -= amount
                    n.monie += (apeValue * amount)
                }
                messages.newMessage('APES', side + ' ' + amount + ' apes at ' + formatter.currency(apeValue) + ' for a total of ' + formatter.currency((amount*apeValue)))
                return n
            }),
        },
        dogSell: () => update((n) => {
            if (n.dogs.amount > 0 && n.dogs.treats > 0) {
                let deathChance = 0.999 * (0.999 + (n.dogs.waters*0.00001))
                if (Math.random() > deathChance) {
                    n.dogs.amount -= 1
                    messages.newMessage('DOGS', 'Fuck. One of your ore selling dogs just had a massive corinary on the trading floor, you\'re pushing them too hard!!')
                }
            }
            if (n.dogs.treats == 0) {
                if (((n.ore - n.dogs.amount) > 0)) {
                    n.ore -= n.dogs.amount
                    n.monie += n.dogs.amount*oreValue
                }
            } else if (n.dogs.treats > 0) {
                if (((n.ore - (n.dogs.amount * (Math.pow(n.dogs.treats,2)))) > 0)) {
                    n.ore -= n.dogs.amount * (Math.pow(n.dogs.treats,2))
                    n.monie += (n.dogs.amount * (Math.pow(n.dogs.treats,2)))*oreValue
                }
            }
            return n
        }),
        rug: () => update((n) => {
            if (Math.random() > 0.99999) {
                if (n.apes > 0) {
                    n.apes = 0
                    messages.newMessage('APES', 'OMG!!! OOH NOOOOOOO!!!! ALLL MY APES GONE!!!!!!!!')
                } else {
                    ape.changePrice()
                    messages.newMessage('APES', 'Did you just feel something?')
                }
            }
            return n
        })
    }
}

export const player = createPlayer()