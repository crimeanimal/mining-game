<script>
    import { player } from "$lib/stores/player";
    import { stone } from "$lib/stores/stone";
    import { formatter } from "$lib/formatter";
    import {onMount} from 'svelte';

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

<div class="card w-96 bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Welcome to the Mines</h2>
      <p>Current stone:</p>
        <p class="font-medium">{$stone.name}</p>
        <p>Difficulty: {formatter.item($stone.difficulty)}</p>
        <p>Stone Health: {formatter.item($stone.health)}</p>
        <p>Reward: {formatter.item($stone.reward)}</p>
        <br>
        <p class={ bounce ? 'animate-bounce' : ''}>You are level {$player.level}</p>
        <p>You have {formatter.item(Math.round($player.xp))} xp</p>
        <p>You need {formatter.item(Math.round($player.xpPerLevel-$player.xp))} xp to level up</p>
        <p>You have {formatter.item($player.ore)} ore</p>
        <p>You have {formatter.item($player.picks.upgrades)} pick upgrades and do {formatter.item($player.picks.total_damage())} damage per hit</p>
        <p>You have {formatter.item($player.drills.amount)} drills doing {formatter.item($player.drills.damage)} damage per tick</p>
        <p class={ hasEverHadDogs ? '' : 'invisible'}>You have {formatter.item($player.dogs.amount)} ore selling dogs hopped up on {formatter.item($player.dogs.treats)} treats, selling {formatter.item($player.dogs.total_sells())} ore per tick, which is kinda fucked up to make a little doggie do {#if $player.dogs.waters}, but at least you've given them {formatter.item($player.dogs.waters)} waters{/if}</p>
        {#if hasEverHadDogs && $player.dogs.amount === 0}
            <p class="font-bold text-xl">All of your ore selling dogs have died</p>
        {/if}
        <p>Mine rocks to get more ore</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary" on:click={() => {stone.mine($player.picks.total_damage())}}>mine!</button>
        </div>
    </div>
</div>