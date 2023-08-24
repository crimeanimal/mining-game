import { writable } from 'svelte/store';
import { generate, count } from "random-words";
import nlp from 'compromise/two'

function createStone() {
    const { subscribe, set, update } = writable(
        {
            name: '',
            health: 0,
            difficulty: 20,
            reward: 0
        }
    )
    return {
        subscribe,
        set,
        update,
        mine: (/** @type {number} */ playerDamage) => update((n) => {
            n.health -= playerDamage
            return n
        }),
        drill: (/** @type {number} */ damage) => update((n) => {
            n.health -= damage
            return n
        }),
        newStone: () => update((n) => {
            let rocks = ['stone','pebble','boulder','rock','chunk of concrete','shard of glass','brick']
            /**
             * @type {{ text: string; }[]}
             */
            let adverb = []
            while (true) {
                let doc = nlp(generate({ exactly: 500, minLength: 4, join: " " }))
                adverb = doc.match('#Adverb #Adjective').json()
                if (adverb.length > 0) {
                    break
                }
            }
            let arr = (adverb[0].text + ' ' + rocks[Math.floor(Math.random() * rocks.length)]).split(" ")
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }
            let min = n.difficulty+=n.difficulty*0.01
            let max = n.difficulty+=n.difficulty*0.1
            let difficulty = Math.round(Math.floor(Math.random() * (max - min) + min))
            return n = {
                name: arr.join(' '),
                health: Math.round(difficulty * (Math.random() * (0.7 - 0.5) + 0.5)),
                difficulty: difficulty,
                reward: Math.round(difficulty * (Math.random() * (0.7 - 0.5) + 0.5))
            }
        })
    }
}

export const stone = createStone()