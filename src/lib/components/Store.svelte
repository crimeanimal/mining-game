<script>
    import { inventoryStore } from '$lib/stores/store'
    import { playerStore } from '$lib/stores/player';

    let stuffFormatter = new Intl.NumberFormat("en-US", {
        notation: 'compact'
    })

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
     * @param {any} id
     * @param {number} quantity
     */
    function buy(id, quantity) {
        let item = inventory.find(item => item.id === id);

        switch (item.id) {
            case 1:
                playerStore.update((player) => {
                    player.pick_upgrades += quantity
                    player.monie -= (item.price * quantity)
                    return player
                })
                updatePrice(id, quantity)
                break;
            case 2:
                playerStore.update((player) => {
                    player.drills += quantity
                    player.monie -= (item.price * quantity)
                    return player
                })
                updatePrice(id, quantity)
                break;

            case 3:
                playerStore.update((player) => {
                    player.damage += quantity
                    player.monie -= (item.price * quantity)
                    return player
                })
                updatePrice(id, quantity)
                break;

            case 4:
                playerStore.update((player) => {
                    player.drill_damage += quantity
                    player.monie -= (item.price * quantity)
                    return player
                })
                updatePrice(id, quantity)
                break;
        
            default:
                break;
        }
    }

    /**
     * @param {number} id
     * @param {number} quantity
     */
    function updatePrice(id, quantity) {
        inventoryStore.update((inv) => {
            let itemIndex = inv.findIndex(item => item.id === id);
            inv[itemIndex].price += ((inv[itemIndex].price * 0.03)*quantity)
            return inv
        })
    }
</script>

<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the Store</p>
    <p>Here you can buy upgrades for your equipment</p>

    <h3>Inventory:</h3>

    <div class="grid grid-cols-2">
        {#each inventory as item (item.id)}
            {#if item.unlock <= player.level}
                <div>
                    <p class="font-bold">{item.name}</p>
                    <p>{item.description}</p>
                    <p>{'₥'+stuffFormatter.format(item.price)}</p>
                    <div class="grid grid-cols-2">
                        {#if item.price > player.monie}
                            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 1)} disabled>buy 1</button>
                        {:else}
                            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 1)}>buy 1</button>
                        {/if}
                        {#if (item.price*10) > player.monie}
                            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 10)} disabled>buy 10</button>
                        {:else}
                            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 10)}>buy 10</button>
                        {/if}
                        {#if (item.price*100) > player.monie}
                            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 100)} disabled>buy 100</button>
                        {:else}
                            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 100)}>buy 100</button>
                        {/if}
                        {#if (item.price*1000) > player.monie}
                            <button class="h-10 px-3 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 1000)} disabled>buy 1000</button>
                        {:else}
                            <button class="h-10 px-3 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 1000)}>buy 1000</button>
                        {/if}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>