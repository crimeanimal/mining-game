<script>
    import { inventoryStore } from '$lib/stores/store'
    import { playerStore } from '$lib/stores/player';

    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; level: number;}}
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
    function buy(id) {
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
        if (item.id === 2) {
            playerStore.update((player) => {
                player.drills += 1
                player.monie -= item.price
                return player
            })
            inventoryStore.update((inv) => {
                let itemIndex = inv.findIndex(item => item.id === id);
                inv[itemIndex].price += (inv[itemIndex].price * 0.1)
                return inv
            })
        }
        if (item.id === 3) {
            playerStore.update((player) => {
                player.damage += 1
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

<div class="container">
    <p class="font-bold text-3xl">Welcome to the Store</p>
    <p>Here you can buy upgrades for your equipment</p>

    <h3>Inventory:</h3>

    <div class="grid grid-cols-2">
        {#each inventory as item (item.id)}
            {#if item.unlock <= player.level}
                <div>
                    <p class="font-bold">{item.name}</p>
                    <p>{item.description}</p>
                    <p>{'₥'+item.price.toFixed(2)}</p>
                    {#if item.price > player.monie}
                        <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id)} disabled>buy</button>
                    {:else}
                        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id)}>buy</button>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
</div>