<script>
    import { ore } from '$lib/stores/ore.js';
    import { player } from '$lib/stores/player';
    // @ts-ignore
    import { messages } from '$lib/stores/message';
    import kaching from '$lib/sounds/kaching.mp3'
    import {onMount} from 'svelte';
    import Chart from 'chart.js/auto';
    import { Colors } from 'chart.js';
    import { settings } from '$lib/stores/settings';

    Chart.register(Colors);

    /**
     * @type {Chart<"line", number[], number>}
     */
    let chart
    onMount(() => {
        const interval = setInterval(changePrice, 1000);
        
        const ctx = document.getElementById('chart');
        Chart.defaults.backgroundColor = '#d3d3d3';
        Chart.defaults.borderColor = '#d3d3d3';
        Chart.defaults.color = '#d3d3d3';

        // @ts-ignore
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [new Date().toLocaleTimeString()],
                datasets: [{
                        label: 'Ore Price',
                        data: [],
                        fill: true,
                        tension: 0.1,
                        borderColor: 'rgba(248, 150, 201, 1)',
                        backgroundColor: 'rgba(248, 150, 201, .25)',
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

    let stuffFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: 'compact'
    })

    
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
                dataset.data = dataset.data.slice(-60);
                // @ts-ignore
                chart.data.labels.push(label);
                // @ts-ignore
                chart.data.labels = chart.data.labels.slice(-60);
                chart.update();
            }
        });
    }

    function changePrice() {
        let change
        if (Math.random() > 0.5) {
            change = $ore.price * 0.12
            $ore.price += change
        } else {
            change = $ore.price * 0.1
            $ore.price -= change
        }
        let time = new Date().toLocaleTimeString()
        $ore.priceHistory = [...$ore.priceHistory, $ore.price]
        addData(chart, time, $ore.price)
    }

    let oreAmountBuy = 1
    let oreAmountSell = 1

    const sleep = (/** @type {number} */ ms) => new Promise(r => setTimeout(r, ms));

    /**
     * @param {number} oreAmount
     */
    async function chaChings(oreAmount) {
        let i = 0
        while (i < oreAmount) {
            let cashRegister = new Audio(kaching)
            cashRegister.volume = 0.2
            cashRegister.play();
            await sleep(50)
            i++
        }
    }
    
    /**
     * @param {number} oreAmount
     */
    function sellOre(oreAmount) {
        $player.ore -= oreAmount
        $player.monie += ($ore.price * oreAmount)
        if ($settings.sounds) {
            chaChings(oreAmount)
        }
        messages.newMessage('Sold ' + oreAmount + ' ore at ₥' + stuffFormatter.format($ore.price) + ' for a total of ₥' + stuffFormatter.format((oreAmount*$ore.price)))
    }

    /**
     * @param {number} oreAmount
     */
     function buyOre(oreAmount) {
        $player.monie -= ($ore.price * oreAmount)
        $player.ore += oreAmount
        if ($settings.sounds) {
            chaChings(oreAmount)
        }
        messages.newMessage('Bought ' + oreAmount + ' ore at ₥' + stuffFormatter.format($ore.price) + ' for a total of ₥' + stuffFormatter.format((oreAmount*$ore.price)))
    }
</script>

<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the Ore Dump</p>
    <p>Sell ore to get monie</p>
    <p>Ore is selling for <span class="font-bold text-1xl">₥{stuffFormatter.format($ore.price)}</span> monies</p>
    <p>
        You have <span class="font-bold text-1xl">{stuffFormatter.format($player.ore)}</span> ore
        {#if $player.ore >=1 }
            worth <span class="font-bold text-1xl">₥{stuffFormatter.format($player.ore*$ore.price)}</span>
        {/if}
    </p>
    <p>You have ₥{stuffFormatter.format($player.monie)} monies</p>

    <div class="grid grid-cols-2 px-4">
        {#if $player.ore > 0}
            <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellOre(1)}>sell one!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellOre(1)} disabled>sell one!</button>
        {/if}
        {#if $player.ore >= 10}
            <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellOre(10)}>sell ten!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellOre(10)} disabled>sell ten!</button>
        {/if}
        {#if $player.ore >= oreAmountSell && oreAmountSell != 0}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={oreAmountSell} />
            <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg" on:click={() => sellOre(oreAmountSell)}>
                sell {stuffFormatter.format(oreAmountSell)}!
            </button>
        {:else}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={oreAmountSell} />
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" disabled on:click={() => sellOre(oreAmountSell)}>
                sell {stuffFormatter.format(oreAmountSell)}!
            </button>
        {/if}
        {#if $player.ore > 1}
            <button class="bg-red-700 col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellOre($player.ore)}>sell all!</button>
        {:else}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellOre($player.ore)} disabled>sell all!</button>
        {/if}
    </div>
    <canvas id='chart' class=""></canvas>
    <div class="grid grid-cols-2 px-4">
        {#if $player.monie > $ore.price}
            <button class="bg-green-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(1)}>buy one!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyOre(1)} disabled>buy one!</button>
        {/if}
        {#if $player.monie > ($ore.price * 10)}
            <button class="bg-green-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(10)}>buy ten!</button>
        {:else}
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyOre(10)} disabled>buy ten!</button>
        {/if}
        {#if $player.monie > ($ore.price * oreAmountBuy) && oreAmountBuy != 0}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={oreAmountBuy} />
            <button class="bg-green-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(oreAmountBuy)}>
                buy {stuffFormatter.format(oreAmountBuy)}!
            </button>
        {:else}
            <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={oreAmountBuy} />
            <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" disabled on:click={() => buyOre(oreAmountBuy)}>
                buy {stuffFormatter.format(oreAmountBuy)}!
            </button>
        {/if}
        {#if $player.monie > (($player.monie / $ore.price)+1)}
            <button class="bg-green-700 col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyOre(Math.round(($player.monie / $ore.price)))}>buy {Math.round(($player.monie / $ore.price))}!</button>
        {:else}
            <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyOre(Math.round(($player.monie / $ore.price)))} disabled>buy {Math.round(($player.monie / $ore.price))}!</button>
        {/if}
    </div>
</div>