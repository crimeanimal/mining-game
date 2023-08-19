<script>
    import { oreTotalStore, orePriceStore } from '$lib/stores/ore.js';
    import { monieStore } from '$lib/stores/monie';
    import Mine from '$lib/components/Mine.svelte';
    import Sell from '$lib/components/Sell.svelte';

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
</script>

<Mine />
<Sell />