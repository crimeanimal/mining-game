<script>
    import {onMount} from 'svelte';
    import { apePriceHistoryStore, apePriceStore } from '$lib/stores/ape';
    import { playerStore } from '$lib/stores/player';
    import Chart from 'chart.js/auto';
    import { Colors } from 'chart.js';
    // @ts-ignore
    import { messageStore } from '$lib/stores/message'

    Chart.register(Colors);
    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; apes: number; }}
     */
    let player
    playerStore.subscribe((value) => {
        player = value
    })

    /**
    * @type {number[]} 
    */
    let apePriceHistory=[]
    apePriceHistoryStore.subscribe((value) => {
		apePriceHistory = value;
	});

    /**
     * @type {number}
     */
    let apePrice
    apePriceStore.subscribe((value) => {
		apePrice = value;
	});

    let walletConnected = false
    function connectWallet() {
        walletConnected = true
    }

    /**
     * @param {any} content
     */
    function addMessage(content) {
        let message = {
            time: new Date().toLocaleTimeString(),
            content: content
        }
        messageStore.update((/** @type {any} */ messages) => {
            return [message, ...messages]
        })
    }

    /**
     * @type {Chart<"line", number[], number>}
     */
     let chart
    onMount(() => {
        const interval = setInterval(changePrice, 1000);
        
        const ctx = document.getElementById('chartApe');
        Chart.defaults.backgroundColor = '#d3d3d3';
        Chart.defaults.borderColor = '#d3d3d3';
        Chart.defaults.color = '#d3d3d3';

        // @ts-ignore
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [new Date().toLocaleTimeString()],
                datasets: [{
                        label: 'Ape Price',
                        data: [],
                        fill: true,
                        tension: 0.1,
                        borderColor: 'rgba(150, 180, 248, 1)',
                        backgroundColor: 'rgba(150, 180, 248, .25)',
                    }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        

        return () => {
            clearInterval(interval);
        };
    });

    /**
     * @param {Chart<"line", number[], number>} chart
     * @param {string} label
     * @param {number} newData
     */
     function addData(chart, label, newData) {
        chart.data.datasets.forEach((dataset) => {
            if (dataset.label === 'Ape Price') {
                dataset.data.push(newData);
                dataset.data = dataset.data.slice(-100);
                // @ts-ignore
                chart.data.labels.push(label);
                // @ts-ignore
                chart.data.labels = chart.data.labels.slice(-100);
                chart.update();
            }
        });
    }

    function changePrice() {
        apePriceStore.update((apePrice) => {
            let change
            if (Math.random() > 0.99999) {
                if (player.apes > 0) {
                    playerStore.update((player) => {
                        player.apes = 0
                        return player
                    })
                    addMessage('OMG!!! OOH NOOOOOOO!!!! ALLL MY APES GONE!!!!!!!!')
                } else {
                    change = apePrice * 0.012
                    apePrice += change
                    addMessage('Did you just feel something?')
                }
            } else if (Math.random() > 0.8) {
                change = apePrice * 0.04
                apePrice += change
            } else if (Math.random() > 0.5) {
                change = apePrice * 0.012
                apePrice += change
            } else if (Math.random() > 0.2) {
                change = apePrice * 0.02
                apePrice -= change
            } else if (Math.random() > 0) {
                change = apePrice * 0.05
                apePrice -= change
            }
            let time = new Date().toLocaleTimeString()
            apePriceHistoryStore.update(priceHistory => [...priceHistory, apePrice])
            addData(chart, time, apePrice)
            return apePrice
        })
    }

    /**
     * @param {number} apeAmount
     */
    function sellApe(apeAmount) {
        playerStore.update((player) => {
            player.monie += (apePrice * apeAmount)
            player.apes -= apeAmount
            return player
        })
        addMessage('Sold ' + apeAmount + ' ape at ₥' + apePrice.toLocaleString() + ' for a total of ₥' + (apeAmount*apePrice).toLocaleString())
    }

    let apeAmountBuy = 1
    let apeAmountSell = 1

    /**
     * @param {number} apeAmount
     */
     function buyApe(apeAmount) {
        playerStore.update((player) => {
            player.monie -= (apePrice * apeAmount)
            player.apes += apeAmount
            return player
        })
        addMessage('Bought ' + apeAmount + ' apes at ₥' + apePrice.toLocaleString() + ' for a total of ₥' + (apeAmount*apePrice).toLocaleString())
    }
</script>

<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the APE TERMINAL</p>
    <p>Sell apes to get monie</p>
    <p>Apes are selling for <span class="font-bold text-1xl">₥{apePrice.toLocaleString()}</span> monies</p>
    <p>You have <span class="font-bold text-1xl">{Math.round(player.apes)}</span> ape</p>
    <p>You have ₥{player.monie.toLocaleString()} monies</p>

    <div class="grid grid-cols-2 px-4">
        {#if player.apes > 0}
            <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellApe(1)}>sell one!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellApe(1)} disabled>sell one!</button>
        {/if}
        {#if player.apes > 10}
            <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellApe(10)}>sell ten!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellApe(10)} disabled>sell ten!</button>
        {/if}
        {#if player.apes > apeAmountSell && apeAmountSell != 0}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={apeAmountSell} />
            <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg" on:click={() => sellApe(apeAmountSell)}>
                sell {apeAmountSell}!
            </button>
        {:else}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={apeAmountSell} />
            <button class=" h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" disabled on:click={() => sellApe(apeAmountSell)}>
                sell {apeAmountSell}!
            </button>
        {/if}
        {#if player.apes > 1}
            <button class="bg-red-700 col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellApe(player.apes)}>sell all!</button>
        {:else}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellApe(player.apes)} disabled>sell all!</button>
        {/if}
    </div>
    <div>
        {#if walletConnected}
            <p>ok ty</p>
        {:else}
            <button class="bg-gray-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={connectWallet}>Connect Wallet</button>
        {/if}
    </div>
    <canvas id='chartApe' class=""></canvas>
    <div class="grid grid-cols-2 px-4">
        {#if player.monie > apePrice}
            <button class="bg-green-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(1)}>buy one!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyApe(1)} disabled>buy one!</button>
        {/if}
        {#if player.monie > (apePrice * 10)}
            <button class=" bg-green-700h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(10)}>buy ten!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyApe(10)} disabled>buy ten!</button>
        {/if}
        {#if player.monie > (apePrice * apeAmountBuy) && apeAmountBuy != 0}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={apeAmountBuy} />
            <button class="bg-green-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(apeAmountBuy)}>
                buy {apeAmountBuy}!
            </button>
        {:else}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={apeAmountBuy} />
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" disabled on:click={() => buyApe(apeAmountBuy)}>
                buy {apeAmountBuy}!
            </button>
        {/if}
        {#if player.monie > (player.monie / apePrice)}
            <button class="bg-green-700 col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(Math.round((player.monie / apePrice)))}>buy {Math.round((player.monie / apePrice))}!</button>
        {:else}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyApe(Math.round((player.monie / apePrice)))} disabled>buy {Math.round((player.monie / apePrice))}!</button>
        {/if}
    </div>
</div>