<script>
    import { shop } from '$lib/stores/shop'
    import { player } from '$lib/stores/player';
    import { messages } from '$lib/stores/message';
    import arm from '$lib/images/shop/arm.jpg'
    import bottle from '$lib/images/shop/bottle.webp'
    import bits from '$lib/images/shop/diamond_bit.webp'
    import dog from '$lib/images/shop/dog.webp'
    import drill from '$lib/images/shop/drill.jpg'
    import pick from '$lib/images/shop/pick.png'
    import treats from '$lib/images/shop/treats.webp'
    import { formatter } from '$lib/formatter';

    let images = [pick,drill,arm,bits,dog,treats,bottle]

    /**
     * @param {any} id
     * @param {number} quantity
     */
    function buy(id, quantity) {
        /**
         * @type {{ id: number; name: string; description: string; price: number; unlock: number; } | 0 }
         */
        let item = $shop.inventory.find(item => item.id === id) || 0;

        if (item == 0) {
            return
        }

        switch (item.id) {
            case 1:
                $player.picks.upgrades += quantity
                $player.monie -= (item.price * quantity)
                updatePrice(id, quantity)
                break;
            case 2:
                $player.drills.amount += quantity
                $player.monie -= (item.price * quantity)
                updatePrice(id, quantity)
                break;

            case 3:
                $player.picks.damage += quantity
                $player.monie -= (item.price * quantity)
                updatePrice(id, quantity)
                break;

            case 4:
                $player.drills.damage += quantity
                $player.monie -= (item.price * quantity)
                updatePrice(id, quantity)
                break;

            case 5:
                $player.dogs.amount += quantity
                $player.monie -= (item.price * quantity)
                updatePrice(id, quantity)
                break;

            case 6:
                $player.dogs.treats += quantity
                $player.monie -= (item.price * quantity)
                updatePrice(id, quantity)
                messages.newMessage('DOGS', 'Bought ' + quantity + ' dogs at ' + formatter.currency(item.price) + ' for a total of ' + formatter.currency((item.price * quantity)))
                break;

            case 7:
                $player.dogs.waters += quantity
                $player.monie -= (item.price * quantity)
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
        let itemIndex = $shop.inventory.findIndex(item => item.id === id);
        $shop.inventory[itemIndex].price += (($shop.inventory[itemIndex].price * 0.03)*quantity)
    }
</script>

<div class="card w-full bg-base-200 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Welcome to the Store</h2>
        <p>Here you can buy upgrades for your equipment</p>

        <h3>Inventory:</h3>

        <div class="h-96 overflow-auto grid grid-cols-2">
            {#each $shop.inventory as item (item.id)}
                {#if item.unlock <= $player.level}
                    <div class="grid grid-cols-1 container">
                        <img class="h-36 w-2/3 rounded-lg ring-gray-100 justify-self-center" src={images[item.id-1]} alt="">
                        <p class="font-bold">{item.name}</p>
                        <p>{item.description}</p>
                        <p>{formatter.currency(item.price)}</p>
                        <div class="grid grid-cols-2 text-sm">
                            {#if item.price > $player.monie}
                                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 1)} disabled>buy 1</button>
                            {:else}
                                <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 1)}>buy 1</button>
                            {/if}
                            {#if (item.price*10) > $player.monie}
                                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 10)} disabled>buy 10</button>
                            {:else}
                                <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 10)}>buy 10</button>
                            {/if}
                            {#if (item.price*100) > $player.monie}
                                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buy(item.id, 100)} disabled>buy 100</button>
                            {:else}
                                <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buy(item.id, 100)}>buy 100</button>
                            {/if}
                            {#if (item.price*1000) > $player.monie}
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
</div>