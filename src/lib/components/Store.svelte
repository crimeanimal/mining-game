<script>
    import { inventoryStore } from '$lib/stores/store'

    /**
     * @type {any[]}
     */
    let inventory=[];
	inventoryStore.subscribe((value) => {
		inventory = value;
	});
</script>

<h1>Welcome to the store</h1>
<p>Here you can buy upgrades for your equipment</p>

<h3>Inventory:</h3>
<div>
    {#each inventory as item (item.id)}
        <div>
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.price}</p>
            <button>buy</button>
        </div>
    {/each}
</div>