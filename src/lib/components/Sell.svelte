<script>
    import { oreStore } from '$lib/stores/ore.js';
    import { playerStore } from '$lib/stores/player';

    /**
     * @type {{ monie: number; pick_upgrades: number; }}
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
        playerStore.update((currentPlayer) => {
            currentPlayer.monie += (orePrice * currentPlayer.ore)
            currentPlayer.ore = 0
            return currentPlayer
        })
    }

    async function sellOneOre() {
        playerStore.update((currentPlayer) => {
            currentPlayer.monie += orePrice
            currentPlayer.ore -= 1
            return currentPlayer
        })
    }
</script>

<p>Sell ore to get monie</p>
<p>Ore is selling for {orePrice} monies</p>
<p>You have {player.monie.toFixed(2)} monies</p>

<button on:click={sellOneOre}>sell one!</button>
<button on:click={sellAllOre}>sell all!</button>