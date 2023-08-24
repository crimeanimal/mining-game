<script>
    import { player } from "$lib/stores/player";
    import { stone } from "$lib/stores/stone";
    import {onMount} from 'svelte';

    let stuffFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: 'compact'
    })

    let bounce = false

    $: if ($stone.health <= 0) {
        $player.ore += $stone.reward
        $player.xp += $stone.reward
        stone.newStone()
    }

    function bounceASec() {
        bounce = true
        setTimeout(() => bounce = false, 10000)
    }

    $: if ($player.xp >= $player.xpPerLevel) {
        player.levelUp()
        bounceASec()
    }

    onMount(() => {
        const interval = setInterval((()=>stone.drill($player.drills.total_damage())), 1000);
        return () => {
        clearInterval(interval);
        };
    });

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
    <p>You have {stuffFormatter.format($player.picks.upgrades)} pick upgrades and do {stuffFormatter.format($player.picks.total_damage())} damage per hit</p>
    <p>You have {stuffFormatter.format($player.drills.amount)} drills doing {stuffFormatter.format($player.drills.damage)} damage per tick</p>
    <p class={ hasEverHadDogs ? '' : 'invisible'}>You have {stuffFormatter.format($player.dogs.amount)} ore selling dogs hopped up on {stuffFormatter.format($player.dogs.treats)} treats, selling {$player.dogs.total_sells()} ore per tick, which is kinda fucked up to make a little doggie do {#if $player.dogs.waters}, but at least you've given them {stuffFormatter.format($player.dogs.waters)} waters{/if}</p>
    {#if hasEverHadDogs && $player.dogs.amount === 0}
        <p class="font-bold text-xl">All of your ore selling dogs have died</p>
    {/if}
    <p>Mine rocks to get more ore</p>

    <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => {stone.mine($player.picks.total_damage())}}>mine!</button>
</div>