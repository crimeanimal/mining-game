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
    import { formatter } from '$lib/formatter';

    Chart.register(Colors);

    /**
     * @type {Chart<"line", number[], number>}
     */
    let chart
    onMount(() => {
        const interval = setInterval(intervalFunc, 1000);
        
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
                        type: 'logarithmic',
                        ticks: {
                            callback: function(value, index, ticks) {
                                return formatter.chart(value)
                            }
                        }
                    }
                },
                maintainAspectRatio: false
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
                dataset.data = dataset.data.slice(-60);
                // @ts-ignore
                chart.data.labels.push(label);
                // @ts-ignore
                chart.data.labels = chart.data.labels.slice(-60);
                chart.update();
            }
        });
    }

    function intervalFunc() {
        ore.changePrice()
        let time = new Date().toLocaleTimeString()
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
        player.transact.ore('SELL', oreAmount)
        if ($settings.sounds) {
            chaChings(oreAmount > 20? 20 : oreAmount)
        }
    }

    /**
     * @param {number} oreAmount
     */
     function buyOre(oreAmount) {
        player.transact.ore('BUY', oreAmount)
        if ($settings.sounds) {
            chaChings(oreAmount > 20? 20 : oreAmount)
        }
    }

    let buttonClassBase = 'h-10 px-5 m-2 transition-colors duration-150 bg-gray-700 rounded-lg'
    let disabledButtonClass = buttonClassBase + " text-gray-300 cursor-not-allowed"
    let sellButtonClass = buttonClassBase + " bg-red-700 text-gray-100 focus:shadow-outline hover:bg-gray-800"
    let buyButtonClass = buttonClassBase + " bg-green-700 text-gray-100 focus:shadow-outline hover:bg-gray-800"
</script>

<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the Ore Dump</p>
    <p>Sell ore to get monie</p>
    <p>Ore is selling for <span class="font-bold text-1xl">{formatter.currency($ore.price)}</span> monies</p>
    <p>
        You have <span class="font-bold text-1xl">{formatter.item($player.ore)}</span> ore
        {#if $player.ore >=1 }
            worth <span class="font-bold text-1xl">{formatter.currency($player.ore*$ore.price)}</span>
        {/if}
    </p>
    <p>You have {formatter.currency($player.monie)} monies</p>

    <div class="grid grid-cols-2 px-4">
        <button class={($player.ore > 0) ? sellButtonClass : disabledButtonClass} disabled={!($player.ore > 0)} on:click={() => sellOre(1)}>sell one!</button>
        <button class={($player.ore > 10) ? sellButtonClass : disabledButtonClass} disabled={!($player.ore > 10)} on:click={() => sellOre(10)}>sell ten!</button>
        <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={oreAmountSell} />
        <button class={$player.ore >= oreAmountSell && oreAmountSell != 0 ? sellButtonClass : disabledButtonClass} disabled={!($player.ore >= oreAmountSell) && oreAmountSell != 0} on:click={() => sellOre(oreAmountSell)}>
            sell {formatter.item(oreAmountSell)}!
        </button>
        <button class={($player.ore > 1) ? sellButtonClass + ' col-span-2' : disabledButtonClass + ' col-span-2'} disabled={!($player.ore > 1)} on:click={() => sellOre($player.ore)}>sell all!</button>
    </div>
    <div class="relative mx-auto h-64 w-11/12">
        <canvas id='chart' class=""></canvas>
    </div>
    <div class="grid grid-cols-2 px-4">
        <button class={($player.monie > $ore.price) ? buyButtonClass : disabledButtonClass} disabled={!($player.monie > $ore.price)} on:click={() => buyOre(1)}>buy one!</button>
        <button class={($player.monie > ($ore.price * 10)) ? buyButtonClass : disabledButtonClass} disabled={!($player.monie > ($ore.price * 10))} on:click={() => buyOre(10)}>buy ten!</button>
        <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={oreAmountBuy} />
        <button class={$player.monie > ($ore.price * oreAmountBuy) && oreAmountBuy != 0 ? buyButtonClass : disabledButtonClass} disabled={!($player.monie > ($ore.price * oreAmountBuy)) && oreAmountBuy != 0}  on:click={() => buyOre(oreAmountBuy)}>
            buy {formatter.item(oreAmountBuy)}!
        </button>
        <button class={(((Math.round($player.monie / $ore.price))-1) > 0) ? buyButtonClass + ' col-span-2' : disabledButtonClass + ' col-span-2'} disabled={!(((Math.round($player.monie / $ore.price))-1) > 0)} on:click={() => buyOre(Math.round(($player.monie / $ore.price))-1)}>buy {(Math.round(($player.monie / $ore.price))-1) > 0 ? (Math.round(($player.monie / $ore.price))-1) : 0}!</button>
    </div>
</div>