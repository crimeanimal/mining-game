<script>
    import { oreTotalStore, orePriceStore } from '$lib/stores/ore.js';
    import { monieStore } from '$lib/stores/monie';

    let ore=0;
	oreTotalStore.subscribe((value) => {
		ore = value;
	});

    let orePrice = 0
    orePriceStore.subscribe((value) => {
		orePrice = value;
	});

    
    async function mine() {
        oreTotalStore.update((currentOre) => {
            return currentOre + 1
        })
    }

    let monie=0;
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

<h1>Welcome to the Mines</h1>
<p>You have {ore} ore</p>
<p>Mine rocks to get more ore</p>

<button on:click={mine}>mine!</button>

<p>Sell ore to get monie</p>
<p>Ore is selling for {orePrice} monies</p>
<p>You have {monie.toFixed(2)} monies</p>

<button on:click={sellOneOre}>sell one!</button>
<button on:click={sellAllOre}>sell all!</button>
