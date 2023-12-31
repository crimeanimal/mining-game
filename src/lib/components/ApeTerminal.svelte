<script>
    import {onMount} from 'svelte';
    import { ape } from '$lib/stores/ape';
    import { wallet } from '$lib/stores/wallet';
    import { player } from '$lib/stores/player';
    import { formatter } from '$lib/formatter';
    import Chart from 'chart.js/auto';
    import { Colors } from 'chart.js';
    import { ore } from '$lib/stores/ore';
    import { messages } from '$lib/stores/message'

    Chart.register(Colors);

    /**
     * @type {Chart<"line", number[], number>}
     */
     let chart
    onMount(() => {
        const interval = setInterval(intervalFunc, 1000);
        
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
     * @param {string} label
     * @param {number} newData
     */
     function addData(chart, label, newData) {
        chart.data.datasets.forEach((dataset) => {
            if (dataset.label === 'Ape Price') {
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
        // Change Price 
        ape.changePrice()
        let time = new Date().toLocaleTimeString()
        addData(chart, time, $ape.price)
        // Dogs sell
        player.dogSell()
        // Rug?
        player.rug()
    }

    /**
     * @param {number} apeAmount
     */
    function sellApe(apeAmount) {
        player.transact.apes('SELL', apeAmount)
    }

    let apeAmountBuy = 1
    let apeAmountSell = 1

    /**
     * @param {number} apeAmount
     */
     function buyApe(apeAmount) {
        player.transact.apes('BUY', apeAmount)
    }

    let buttonClassBase = 'h-10 px-5 m-2 transition-colors duration-150 bg-gray-700 rounded-lg'
    let disabledButtonClass = buttonClassBase + " text-gray-300 cursor-not-allowed"
    let sellButtonClass = buttonClassBase + " bg-red-700 text-gray-100 focus:shadow-outline hover:bg-gray-800"
    let buyButtonClass = buttonClassBase + " bg-green-700 text-gray-100 focus:shadow-outline hover:bg-gray-800"

    let sell = false
</script>

<div class="card w-full bg-base-200 shadow-xl">
    <figure>
        <div class="relative mx-auto h-64 w-11/12">
            <canvas id='chartApe' class=""></canvas>
        </div>
    </figure>
    <div class="card-body">
        <h2 class="card-title">Welcome to the APE TERMINAL</h2>
        <p>Sell apes to get monie</p>
        <p>Apes are selling for <span class="font-bold text-1xl">{formatter.currency($ape.price)}</span> monies</p>
        <p>You have <span class="font-bold text-1xl">{formatter.item(Math.round($player.apes))}</span> ape</p>
        <p>You have {formatter.currency($player.monie)} monies</p>

        <div>
            {#if !$wallet.connected}
                <p class="font-bold text-xl">Please connect your wallet to trade apes</p>
            {/if}
        </div>

        <div class="card-actions text-sm">
            <div class="form-control">
                <label class="label cursor-pointer ">
                  <div class="space-x-2">
                    <span class="label-text">buy/sell </span> 
                    <input type="checkbox" class="toggle" bind:checked={sell} />
                  </div>
                </label>
              </div>
            {#if sell}
                {#if $wallet.connected}
                    <div class="grid grid-cols-2 px-4">
                        <button class={$player.apes > 0 ? sellButtonClass : disabledButtonClass} disabled={!($player.apes > 0)} on:click={() => sellApe(1)}>sell one!</button>
                        <button class={$player.apes >= 10 ? sellButtonClass : disabledButtonClass} disabled={!($player.apes >= 10)} on:click={() => sellApe(10)}>sell ten!</button>
                        <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={apeAmountSell} />
                        <button class={$player.apes >= apeAmountSell && apeAmountSell != 0 ? sellButtonClass : disabledButtonClass} disabled={!($player.apes >= apeAmountSell) && apeAmountSell != 0} on:click={() => sellApe(apeAmountSell)}>
                            sell {apeAmountSell}!
                        </button>
                        <button class={$player.apes > 1 ? sellButtonClass + ' col-span-2' : disabledButtonClass + ' col-span-2'} disabled={!($player.apes > 1)} on:click={() => sellApe($player.apes)}>sell all!</button>
                    </div>
                {/if}
            {:else}
                {#if $wallet.connected}
                    <div class="grid grid-cols-2 px-4">
                        <button class={$player.monie > $ape.price ? buyButtonClass : disabledButtonClass} on:click={() => buyApe(1)}>buy one!</button>
                        <button class={$player.monie > ($ape.price * 10) ? buyButtonClass : disabledButtonClass} on:click={() => buyApe(10)}>buy ten!</button>
                        <input class="bg-gray-700 focus:bg-gray-700" type="number" bind:value={apeAmountBuy} />
                        <button class={$player.monie > ($ape.price * apeAmountBuy) && apeAmountBuy != 0 ? buyButtonClass : disabledButtonClass} disabled={!($player.monie > ($ape.price * apeAmountBuy)) && apeAmountBuy != 0} on:click={() => buyApe(apeAmountBuy)}>
                            buy {apeAmountBuy}!
                        </button>
                        <button class={(((Math.round($player.monie / $ape.price))-1) > 0) ? buyButtonClass + ' col-span-2' : disabledButtonClass + ' col-span-2'} disabled={!(((Math.round($player.monie / $ape.price))-1) > 0)} on:click={() => buyApe(Math.round(($player.monie / $ape.price)-1))}>buy {(Math.round(($player.monie / $ape.price))-1) > 0 ? (Math.round(($player.monie / $ape.price))-1) : 0}!</button>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>