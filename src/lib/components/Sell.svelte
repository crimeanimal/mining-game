<script>
    import { oreStore } from '$lib/stores/ore.js';
    import { playerStore } from '$lib/stores/player';

    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; }}
     */
    let player
    playerStore.subscribe((value) => {
        player = value
    })

    /**
     * @type {number}
     */
    let orePrice
    oreStore.subscribe((value) => {
		orePrice = value;
	});
    
    async function sellAllOre() {
        playerStore.update((player) => {
            player.monie += (orePrice * player.ore)
            player.ore = 0
            return player
        })
    }

    async function sellOneOre() {
        playerStore.update((player) => {
            player.monie += orePrice
            player.ore -= 1
            return player
        })
    }
</script>

<p>Sell ore to get monie</p>
<p>Ore is selling for {orePrice} monies</p>
<p>You have {player.monie.toFixed(2)} monies</p>

{#if player.ore > 0}
    <button on:click={sellOneOre}>sell one!</button>
{:else}
    <button on:click={sellOneOre} disabled>sell one!</button>
{/if}
{#if player.ore > 1}
    <button on:click={sellAllOre}>sell all!</button>
{:else}
    <button on:click={sellAllOre} disabled>sell all!</button>
{/if}