<script>
    import { playerStore } from "$lib/stores/player";
    import { generate, count } from "random-words";
    import { stoneStore } from "$lib/stores/stone";
    import nlp from 'compromise/two'
    import {onMount} from 'svelte';


    /**
     * @type {{ ore: any, pick_upgrades: number, drills: number }}
     */
    let player
	playerStore.subscribe((value) => {
		player = value;
	});

    /**
     * @type {{ name: any; health: number, difficulty: number; reward: number; }}
     */
    let stone
	stoneStore.subscribe((value) => {
		stone = value;
	});

    async function mine() {
        let playerDamage = 1+(player.pick_upgrades * 0.1)
        stoneStore.update((stone) => {
            stone.health -= playerDamage
            return stone
        })
    }

    async function drill() {
        stoneStore.update((stone) => {
            stone.health -= (1 * player.drills)
            return stone
        })
    }

    $: if (stone.health <= 0) {
        playerStore.update((player) => {
            player.ore += stone.reward
            newRock()
            return player
        })
    }

    async function newRock() {
        let rocks = ['stone','pebble','boulder','rock','chunk','shard']
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
        // @ts-ignore
        let arr = (adverb[0].text + ' ' + rocks[Math.floor(Math.random() * rocks.length)]).split(" ")
        for (var i = 0; i < arr.length; i++) {
            // @ts-ignore
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        let difficulty = Math.floor(Math.random() * 100)
        console.log({
            name: arr.join(' '),
            difficulty: difficulty,
            reward: Math.round(difficulty * (Math.random()*1))
        })
        stoneStore.update((stone) => {
            stone = {
                name: arr.join(' '),
                health: difficulty,
                difficulty: difficulty,
                reward: Math.round(difficulty * (Math.random()*1))
            }
            return stone
        })
    }

    onMount(() => {
        const interval = setInterval(drill, 1000);
        return () => {
        clearInterval(interval);
        };
    });
</script>
<div class="container">
    <p class="font-bold text-3xl">Welcome to the Mines</p>
    <p>Current stone:</p>
    <p>{stone.name}</p>
    <p>Difficulty: {stone.difficulty}</p>
    <p>Health: {stone.health}</p>
    <p>Reward: {stone.reward}</p>
    <p>You have {player.ore.toFixed(2)} ore</p>
    <p>You have {player.pick_upgrades} pick upgrades and do {1 + (player.pick_upgrades * 0.1)} damage per hit</p>
    <p>You have {player.drills} drills</p>
    <p>Mine rocks to get more ore</p>

    <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={mine}>mine!</button>
</div>