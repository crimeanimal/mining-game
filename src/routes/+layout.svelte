<script>
    import "../app.css";
    import {onMount} from 'svelte';
    import { settings } from "$lib/stores/settings";
    import { ore } from "$lib/stores/ore";
    import { ape } from "$lib/stores/ape";
    import { wallet } from "$lib/stores/wallet";
    import { player } from "$lib/stores/player";
    import { formatter } from "$lib/formatter";
    import WalletInfo from "$lib/components/WalletInfo.svelte";
    import Settings from "$lib/components/Settings.svelte";

    let stuffFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: 'compact'
    })

    /**
     * @param {number} oldNumber
     * @param {number} newNumber
     */
    function getPercentageChange(oldNumber, newNumber){
        var decreaseValue = oldNumber - newNumber;

        return (decreaseValue / oldNumber) * 100;
    }

    /**
     * @type {number | bigint}
     */
    let oreChange
    let ticks = 60
    $: if ($ore.priceHistory.length > ticks) {
            oreChange = getPercentageChange([...$ore.priceHistory].slice(-ticks)[0], $ore.price)*-1
        } else {
            oreChange = getPercentageChange($ore.priceHistory[0], $ore.price)*-1
        }

    /**
     * @type {number | bigint}
     */
    let apeChange
    $: if ($ape.priceHistory.length > ticks) {
            apeChange = getPercentageChange([...$ape.priceHistory].slice(-(ticks))[0], $ape.price)*-1
        } else {
            apeChange = getPercentageChange($ape.priceHistory[0], $ape.price)*-1
        }

    $: oreChangeall = getPercentageChange($ore.priceHistory[0], $ore.price)*-1

    $: apeChangeAll = getPercentageChange($ape.priceHistory[0], $ape.price)*-1
</script>


<div class="fixed w-full dark:text-gray-100 dark:bg-slate-700 flex">
    <div class="flex justify-start content-end grow">
        <p class="font-bold leading-relaxed px-4 text-3xl">Ore: {formatter.currency($ore.price)} <span class={oreChange > 0 ? 'text-green-400' : oreChange == 0 ? '' : 'text-red-400'}>{#if oreChange > 0}+{/if}{stuffFormatter.format(oreChange)}% <span class={oreChangeall > 0 ? 'text-green-400' : oreChangeall == 0 ? '' : 'text-red-400'}>{#if oreChangeall > 0}+{/if}{stuffFormatter.format(oreChangeall)}%</span></p>
        <p class="font-bold leading-relaxed px-4 text-3xl">Apes: {formatter.currency($ape.price)} <span class={apeChange > 0 ? 'text-green-400' : apeChange == 0 ? '' : 'text-red-400'}>{#if apeChange > 0}+{/if}{stuffFormatter.format(apeChange)}%  <span class={apeChangeAll > 0 ? 'text-green-400' : apeChangeAll == 0 ? '' : 'text-red-400'}>{#if apeChangeAll > 0}+{/if}{stuffFormatter.format(apeChangeAll)}%</span></p>
    </div>
    <div class="">
        <nav class="flex justify-end space-x-2 px-4">
            <WalletInfo />
            <Settings />
        </nav>
    </div>
</div>
<slot />