<script>
    import { oreTotalStore, orePriceStore } from '$lib/stores/ore.js';
    import { monieStore } from '$lib/stores/monie';

    /**
     * @type {number}
     */
    let ore
	oreTotalStore.subscribe((value) => {
		ore = value;
	});

    /**
     * @type {number}
     */
    let orePrice
    orePriceStore.subscribe((value) => {
		orePrice = value;
	});

    /**
     * @type {number}
     */
    let monie
	monieStore.subscribe((value) => {
		monie = value;
	});
    
    async function sellAllOre() {
        monieStore.update((currentMonie) => {
            return currentMonie + (orePrice * ore)
        })
        oreTotalStore.update((currentOre) => {
            return 0
        })
    }

    async function sellOneOre() {
        monieStore.update((currentMonie) => {
            return currentMonie + orePrice
        })
        oreTotalStore.update((currentOre) => {
            return currentOre - 1
        })
    }
</script>

<p>Sell ore to get monie</p>
<p>Ore is selling for {orePrice} monies</p>
<p>You have {monie.toFixed(2)} monies</p>

<button on:click={sellOneOre}>sell one!</button>
<button on:click={sellAllOre}>sell all!</button>