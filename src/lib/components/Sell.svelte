<script>
    import { orePriceHistoryStore, oreStore } from '$lib/stores/ore.js';
    import { playerStore } from '$lib/stores/player';
    import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';

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
     * @param {string} label
     * @param {number} newData
     */
    function addData(chart, label, newData) {
        // @ts-ignore
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(newData);
        });
        chart.update();
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
    
    function sellAllOre() {
        playerStore.update((player) => {
            player.monie += (orePrice * player.ore)
            player.ore = 0
            return player
        })
    }

    function sellOneOre() {
        playerStore.update((player) => {
            player.monie += orePrice
            player.ore -= 1
            return player
        })
    }
</script>

<div class="container">
    <p class="font-bold text-3xl">Welcome to the Ore Dump</p>
    <p>Sell ore to get monie</p>
    <p>Ore is selling for ₥{orePrice.toFixed(2)} monies</p>
    <p>You have ₥{player.monie.toFixed(2)} monies</p>

    {#if player.ore > 0}
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={sellOneOre}>sell one!</button>
    {:else}
        <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={sellOneOre} disabled>sell one!</button>
    {/if}
    {#if player.ore > 1}
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={sellAllOre}>sell all!</button>
    {:else}
        <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={sellAllOre} disabled>sell all!</button>
    {/if}
    <canvas id='chart'></canvas>
</div>