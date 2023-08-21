<script>
    import { orePriceHistoryStore, oreStore } from '$lib/stores/ore.js';
    import { playerStore } from '$lib/stores/player';
    // @ts-ignore
    import { messageStore } from '$lib/stores/message';
    import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';

    let messages
    messageStore.subscribe((value) => {
        messages = value
    })

    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; }}
     */
    let player
    playerStore.subscribe((value) => {
        player = value
    })

    /**
     * @type {number}
     */
    let orePrice
    oreStore.subscribe((value) => {
		orePrice = value;
	});

    /**
    * @type {number[]} 
    */
    let orePriceHistory=[]
    orePriceHistoryStore.subscribe((value) => {
		orePriceHistory = value;
	});

    /**
     * @type {Chart<"line", number[], number>}
     */
    let chart
    onMount(() => {
        const interval = setInterval(changePrice, 1000);
        
        const ctx = document.getElementById('chart');

        // @ts-ignore
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [new Date().toLocaleTimeString()],
                datasets: [{
                        label: 'Ore Price',
                        data: [10],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
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
     */
    function removeData(chart) {
        // @ts-ignore
        chart.data.labels.slice(0, 10);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.slice(0, 10);
        });
    }

    /**
     * @param {Chart<"line", number[], number>} chart
     * @param {string} label
     * @param {number} newData
     */
     function addData(chart, label, newData) {
        chart.data.datasets.forEach((dataset) => {
            if (dataset.label === 'Ore Price') {
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


    /**
     * @param {any} content
     */
    function addMessage(content) {
        let message = {
            time: new Date().toLocaleTimeString(),
            content: content
        }
        messageStore.update((messages) => {
            return [message, ...messages]
        })
    }

    /**
     * @type {string[]}
     */
    let orePriceTime = []
    function changePrice() {
        oreStore.update((orePrice) => {
            let change
            if (Math.random() > 0.5) {
                change = orePrice * 0.12
                orePrice += change
            } else {
                change = orePrice * 0.1
                orePrice -= change
            }
            let time = new Date().toLocaleTimeString()
            orePriceTime = [...orePriceTime, time]
            orePriceHistoryStore.update(priceHistory => [...priceHistory, orePrice])
            console.log(orePriceHistory)
            console.log(orePriceTime)
            addData(chart, time, orePrice)
            return orePrice
        })
    }
    
    /**
     * @param {number} oreAmount
     */
    function sellOre(oreAmount) {
        playerStore.update((player) => {
            player.monie += (orePrice * oreAmount)
            player.ore -= oreAmount
            return player
        })
        addMessage('Sold ' + oreAmount + ' ore at ₥' + orePrice.toFixed(2) + ' for a total of ₥' + (oreAmount*orePrice).toFixed(2))
    }

    /**
     * @param {number} oreAmount
     */
     function buyOre(oreAmount) {
        playerStore.update((player) => {
            player.monie -= (orePrice * oreAmount)
            player.ore += oreAmount
            return player
        })
        addMessage('Bought ' + oreAmount + ' ore at ₥' + orePrice.toFixed(2) + ' for a total of ₥' + (oreAmount*orePrice).toFixed(2))
    }
</script>

<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the Ore Dump</p>
    <p>Sell ore to get monie</p>
    <p>Ore is selling for ₥{orePrice.toFixed(2)} monies</p>
    <p>You have ₥{player.monie.toFixed(2)} monies</p>

    <div class="grid grid-cols-2 px-4">
        {#if player.ore > 0}
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellOre(1)}>sell one!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellOre(1)} disabled>sell one!</button>
        {/if}
        {#if player.ore > 10}
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellOre(10)}>sell ten!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellOre(10)} disabled>sell ten!</button>
        {/if}
        {#if player.ore > 1}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellOre(player.ore)}>sell all!</button>
        {:else}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellOre(player.ore)} disabled>sell all!</button>
        {/if}
    </div>
    <canvas id='chart' class=""></canvas>
    <div class="grid grid-cols-2 px-4">
        {#if player.monie > orePrice}
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(1)}>buy one!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyOre(1)} disabled>buy one!</button>
        {/if}
        {#if player.monie > (orePrice * 10)}
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(10)}>buy ten!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyOre(10)} disabled>buy ten!</button>
        {/if}
        {#if player.monie > (player.monie / orePrice)}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(Math.round((player.monie / orePrice)))}>buy {Math.round((player.monie / orePrice))}!</button>
        {:else}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyOre(player.ore)} disabled>buy all!</button>
        {/if}
    </div>
</div>