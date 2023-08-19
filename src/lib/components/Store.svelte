<script>
    import { inventoryStore } from '$lib/stores/store'
    import { playerStore } from '$lib/stores/player';

    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; }}
     */
     let player
    playerStore.subscribe((value) => {
        player = value
    })
    
    /**
     * @type {any[]}
     */
    let inventory=[];
	inventoryStore.subscribe((value) => {
		inventory = value;
	});

    /**
     * @param {number} id
     */
    async function buy(id) {
        let item = inventory.find(item => item.id === id);
        if (item.id === 1) {
            playerStore.update((player) => {
                player.pick_upgrades += 1
                player.monie -= item.price
                return player
            })
            inventoryStore.update((inv) => {
                let itemIndex = inv.findIndex(item => item.id === id);
                inv[itemIndex].price += (inv[itemIndex].price * 0.1)
                return inv
            })
        }
    }
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
            {#if item.price > player.monie}
                <button on:click={() => buy(item.id)} disabled>buy</button>
            {:else}
                <button on:click={() => buy(item.id)}>buy</button>
            {/if}
        </div>
    {/each}
</div>