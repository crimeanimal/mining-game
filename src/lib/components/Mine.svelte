<script>
    import { oreTotalStore } from '$lib/stores/ore.js';

    let ore=0;
	oreTotalStore.subscribe((value) => {
		ore = value;
	});
    async function mine() {
        oreTotalStore.update((currentOre) => {
            return currentOre + 1
        })
    }
</script>

<h1>Welcome to the Mines</h1>
<p>You have {ore} ore</p>
<p>Mine rocks to get more ore</p>

<button on:click={mine}>mine!</button>