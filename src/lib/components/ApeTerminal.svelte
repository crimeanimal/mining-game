<script>
    import {onMount} from 'svelte';
    // @ts-ignore
    import { ape } from '$lib/stores/ape';
    import { wallet } from '$lib/stores/wallet';
    import { player } from '$lib/stores/player';
    import Chart from 'chart.js/auto';
    import { Colors } from 'chart.js';
    import { ore } from '$lib/stores/ore';
    // @ts-ignore
    import { messages } from '$lib/stores/message'

    Chart.register(Colors);

    let stuffFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: 'compact'
    })

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

    function intervalFunc() {
        changePrice()
        dogSell()
    }

    function changePrice() {
            let change
            if (Math.random() > 0.99999) {
                if ($player.apes > 0) {
                    $player.apes = 0
                    messages.newMessage('OMG!!! OOH NOOOOOOO!!!! ALLL MY APES GONE!!!!!!!!')
                } else {
                    change = $ape.price * 0.012
                    $ape.price += change
                    messages.newMessage('Did you just feel something?')
                }
            } else if (Math.random() > 0.8) {
                change = $ape.price * 0.04
                $ape.price += change
            } else if (Math.random() > 0.5) {
                change = $ape.price * 0.012
                $ape.price += change
            } else if (Math.random() > 0.2) {
                change = $ape.price * 0.02
                $ape.price -= change
            } else if (Math.random() > 0) {
                change = $ape.price * 0.05
                $ape.price -= change
            }
            let time = new Date().toLocaleTimeString()
            $ape.priceHistory = [...$ape.priceHistory, $ape.price]
            addData(chart, time, $ape.price)
    }

    function dogSell() {
        if (($player.ore - $player.dogs) > 0) {
            $player.ore -= $player.dogs
            $player.monie += $player.dogs*$ore.price
        }
    }

    /**
     * @param {number} apeAmount
     */
    function sellApe(apeAmount) {
        $player.apes -= apeAmount
        $player.monie += ($ape.price * apeAmount)
        messages.newMessage('Sold ' + apeAmount + ' ape at ₥' + stuffFormatter.format($ape.price) + ' for a total of ₥' + stuffFormatter.format((apeAmount*$ape.price)))
    }

    let apeAmountBuy = 1
    let apeAmountSell = 1

    /**
     * @param {number} apeAmount
     */
     function buyApe(apeAmount) {
        $player.monie -= ($ape.price * apeAmount)
        $player.apes += apeAmount
        messages.newMessage('Bought ' + apeAmount + ' apes at ₥' + stuffFormatter.format($ape.price) + ' for a total of ₥' + stuffFormatter.format((apeAmount*$ape.price)))
    }
</script>

<div class="container px-4">
    <p class="font-bold text-3xl">Welcome to the APE TERMINAL</p>
    <p>Sell apes to get monie</p>
    <p>Apes are selling for <span class="font-bold text-1xl">₥{stuffFormatter.format($ape.price)}</span> monies</p>
    <p>You have <span class="font-bold text-1xl">{stuffFormatter.format(Math.round($player.apes))}</span> ape</p>
    <p>You have ₥{stuffFormatter.format($player.monie)} monies</p>

    {#if $wallet.connected}
        <div class="grid grid-cols-2 px-4">
            {#if $player.apes > 0}
                <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellApe(1)}>sell one!</button>
            {:else}
                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellApe(1)} disabled>sell one!</button>
            {/if}
            {#if $player.apes >= 10}
                <button class="bg-red-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellApe(10)}>sell ten!</button>
            {:else}
                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellApe(10)} disabled>sell ten!</button>
            {/if}
            {#if $player.apes >= apeAmountSell && apeAmountSell != 0}
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
            {#if $player.apes > 1}
                <button class="bg-red-700 col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => sellApe($player.apes)}>sell all!</button>
            {:else}
                <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => sellApe($player.apes)} disabled>sell all!</button>
            {/if}
        </div>
    {/if}
    <div>
        {#if $wallet.connected}
            <p>ok ty</p>
        {:else}
            <p class="font-bold text-xl">Please connect your wallet to trade apes</p>
        {/if}
    </div>
    <canvas id='chartApe' class=""></canvas>
    {#if $wallet.connected}
        <div class="grid grid-cols-2 px-4">
            {#if $player.monie > $ape.price}
                <button class="bg-green-700 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(1)}>buy one!</button>
            {:else}
                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyApe(1)} disabled>buy one!</button>
            {/if}
            {#if $player.monie > ($ape.price * 10)}
                <button class=" bg-green-700h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(10)}>buy ten!</button>
            {:else}
                <button class="h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyApe(10)} disabled>buy ten!</button>
            {/if}
            {#if $player.monie > ($ape.price * apeAmountBuy) && apeAmountBuy != 0}
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
            {#if $player.monie > (($player.monie / $ape.price)+1)}
                <button class="bg-green-700 col-span-2 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => buyApe(Math.round(($player.monie / $ape.price)))}>buy {Math.round(($player.monie / $ape.price))}!</button>
            {:else}
                <button class="col-span-2 h-10 px-5 m-2 text-gray-300 transition-colors duration-150 bg-gray-700 rounded-lg cursor-not-allowed" on:click={() => buyApe(Math.round(($player.monie / $ape.price)))} disabled>buy {Math.round(($player.monie / $ape.price))}!</button>
            {/if}
        </div>
    {/if}
</div>