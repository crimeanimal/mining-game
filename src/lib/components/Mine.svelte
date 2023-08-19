<script>
    import { playerStore } from "$lib/stores/player";
    import {onMount} from 'svelte';


    /**
     * @type {{ ore: any, pick_upgrades: number, drills: number }}
     */
    let player
	playerStore.subscribe((value) => {
		player = value;
	});

    async function mine() {
        playerStore.update((player) => {
            let upgrade_bonus = player.pick_upgrades * 0.1
            player.ore += (1 + upgrade_bonus)
            return player
        })
    }

    async function drill() {
        playerStore.update((player) => {
            player.ore += (1 * player.drills)
            return player
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
    <p>You have {player.ore.toFixed(2)} ore</p>
    <p>You have {player.pick_upgrades} pick upgrades and get {1 + (player.pick_upgrades * 0.1)} rocks per hit</p>
    <p>You have {player.drills} drills</p>
    <p>Mine rocks to get more ore</p>

    <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={mine}>mine!</button>
</div>