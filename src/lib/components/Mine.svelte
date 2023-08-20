<script>
    import { playerStore } from "$lib/stores/player";
    import { generate, count } from "random-words";
    import { stoneStore } from "$lib/stores/stone";
    import nlp from 'compromise/two'
    import {onMount} from 'svelte';


    /**
     * @type {{ level: number, xpPerLevel: number, xp: number,ore: any, pick_upgrades: number, drills: number, damage: number, drill_damage: number  }}
     */
    let player
	playerStore.subscribe((value) => {
		player = value;
	});

    /**
     * @type {{ name: any; health: number, difficulty: number; reward: number;}}
     */
    let stone
	stoneStore.subscribe((value) => {
		stone = value;
	});

    function mine() {
        let playerDamage = player.damage+(player.pick_upgrades * 0.1)
        stoneStore.update((stone) => {
            stone.health -= playerDamage
            return stone
        })
    }

    function drill() {
        stoneStore.update((stone) => {
            stone.health -= (player.drill_damage * player.drills)
            return stone
        })
    }

    let bounce = false

    $: if (stone.health <= 0) {
        playerStore.update((player) => {
            player.ore += stone.reward
            player.xp += stone.reward
            newRock()
            return player
        })
    }

    function bounceASec() {
        bounce = true
        setTimeout(() => bounce = false, 10000)
    }

    function newRock() {
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
        // @ts-ignore
        let arr = (adverb[0].text + ' ' + rocks[Math.floor(Math.random() * rocks.length)]).split(" ")
        for (var i = 0; i < arr.length; i++) {
            // @ts-ignore
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        let min = 25 * (player.level*0.7)
        let max = 50 * (player.level*0.7)
        let difficulty = Math.round(Math.floor(Math.random() * (max - min) + min))
        console.log({
            name: arr.join(' '),
            difficulty: difficulty,
            reward: Math.round(difficulty * (Math.random()*1))
        })
        stoneStore.update((stone) => {
            stone = {
                name: arr.join(' '),
                health: Math.round(difficulty * (Math.random() * (0.7 - 1) + 0.7)),
                difficulty: difficulty,
                reward: Math.round(difficulty * (Math.random() * (0.5 - 1) + 0.5))
            }
            return stone
        })
    }

    function levelUp() {
        playerStore.update((player) => {
            player.level += 1
            bounceASec()
            player.xp = player.xp - player.xpPerLevel
            player.xpPerLevel += (player.xpPerLevel * 0.1)
            return player
        })
    }

    $: if (player.xp >= player.xpPerLevel) {
        levelUp()
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
    <p class="font-medium">{stone.name}</p>
    <p>Difficulty: {stone.difficulty}</p>
    <p>Health: {stone.health}</p>
    <p>Reward: {stone.reward}</p>
    <br>
    <p class={ bounce ? 'animate-bounce' : ''}>You are level {player.level}</p>
    <p>You have {Math.round(player.xp)}xp</p>
    <p>You need {Math.round(player.xpPerLevel-player.xp)}xp to level up</p>
    <p>You have {player.ore.toFixed(2)} ore</p>
    <p>You have {player.pick_upgrades} pick upgrades and do {player.damage + (player.pick_upgrades * 0.1)} damage per hit</p>
    <p>You have {player.drills} drills</p>
    <p>Mine rocks to get more ore</p>

    <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={mine}>mine!</button>
</div>