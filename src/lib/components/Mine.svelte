<script>
    import { player } from "$lib/stores/player";
    import { generate, count } from "random-words";
    import { stone } from "$lib/stores/stone";
    import nlp from 'compromise/two'
    import {onMount} from 'svelte';

    let stuffFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: 'compact'
    })

    function mine() {
        let playerDamage = $player.damage+($player.pick_upgrades * 0.1)
        $stone.health -= playerDamage
    }

    function drill() {
        $stone.health -= ($player.drills.damage * $player.drills.amount)
    }

    let bounce = false

    $: if ($stone.health <= 0) {
        $player.ore += $stone.reward
        $player.xp += $stone.reward
        newRock()
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
        // let min = 25 * (player.level*0.7)
        // let max = 50 * (player.level*0.7)
        let min = $stone.difficulty+=$stone.difficulty*0.01
        let max = $stone.difficulty+=$stone.difficulty*0.1
        let difficulty = Math.round(Math.floor(Math.random() * (max - min) + min))
        $stone = {
            name: arr.join(' '),
            health: Math.round(difficulty * (Math.random() * (0.7 - 0.5) + 0.5)),
            difficulty: difficulty,
            reward: Math.round(difficulty * (Math.random() * (0.7 - 0.5) + 0.5))
        }
    }

    function levelUp() {
        $player.level += 1
        bounceASec()
        $player.xp = $player.xp - $player.xpPerLevel
        $player.xpPerLevel += ($player.xpPerLevel * 0.1)
    }

    $: if ($player.xp >= $player.xpPerLevel) {
        levelUp()
    }

    onMount(() => {
        const interval = setInterval(drill, 1000);
        return () => {
        clearInterval(interval);
        };
    });

    $: dogPS = () => {
        if ($player.dogs.treats == 0) {
            return stuffFormatter.format($player.dogs.amount)
        } else if ($player.dogs.treats > 0) {
            return stuffFormatter.format($player.dogs.amount * (Math.pow($player.dogs.treats,2)))
        }
    }

    $: dogSellPerTick = dogPS()

    let hasEverHadDogs = false

    $: if ($player.dogs.amount > 0 || hasEverHadDogs == true) {
        hasEverHadDogs = true
    }
</script>
<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the Mines</p>
    <p>Current stone:</p>
    <p class="font-medium">{$stone.name}</p>
    <p>Difficulty: {stuffFormatter.format($stone.difficulty)}</p>
    <p>Stone Health: {stuffFormatter.format($stone.health)}</p>
    <p>Reward: {stuffFormatter.format($stone.reward)}</p>
    <br>
    <p class={ bounce ? 'animate-bounce' : ''}>You are level {$player.level}</p>
    <p>You have {stuffFormatter.format(Math.round($player.xp))}xp</p>
    <p>You need {stuffFormatter.format(Math.round($player.xpPerLevel-$player.xp))}xp to level up</p>
    <p>You have {stuffFormatter.format($player.ore)} ore</p>
    <p>You have {stuffFormatter.format($player.pick_upgrades)} pick upgrades and do {stuffFormatter.format($player.damage + ($player.pick_upgrades * 0.1))} damage per hit</p>
    <p>You have {stuffFormatter.format($player.drills.amount)} drills doing {stuffFormatter.format($player.drills.damage)} damage per tick</p>
    <p class={ hasEverHadDogs ? '' : 'invisible'}>You have {stuffFormatter.format($player.dogs.amount)} ore selling dogs hopped up on {stuffFormatter.format($player.dogs.treats)} treats, selling {dogSellPerTick} ore per tick, which is kinda fucked up to make a little doggie do {#if $player.dogs.waters}, but at least you've given them {stuffFormatter.format($player.dogs.waters)} waters{/if}</p>
    {#if hasEverHadDogs && $player.dogs.amount === 0}
        <p class="font-bold text-xl">All of your ore selling dogs have died</p>
    {/if}
    <p>Mine rocks to get more ore</p>

    <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={mine}>mine!</button>
</div>