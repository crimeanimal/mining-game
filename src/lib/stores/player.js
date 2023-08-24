import { derived, writable } from 'svelte/store';

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
        })
    }
}

export const player = createPlayer()