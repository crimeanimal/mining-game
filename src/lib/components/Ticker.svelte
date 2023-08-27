<script>
    import { ore } from "$lib/stores/ore";
    import { ape } from "$lib/stores/ape";
    import { formatter } from "$lib/formatter";

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

<div class="flex justify-start content-end">
    <p class="font-bold leading-relaxed px-4 xl:text-3xl md:text-lg">Ore: {formatter.currency($ore.price)} <span class={oreChange > 0 ? 'text-green-400' : oreChange == 0 ? '' : 'text-red-400'}>{#if oreChange > 0}+{/if}{formatter.item(oreChange)}% <span class={oreChangeall > 0 ? 'text-green-400' : oreChangeall == 0 ? '' : 'text-red-400'}>{#if oreChangeall > 0}+{/if}{formatter.item(oreChangeall)}%</span></p>
    <p class="font-bold leading-relaxed px-4 xl:text-3xl md:text-lg">Apes: {formatter.currency($ape.price)} <span class={apeChange > 0 ? 'text-green-400' : apeChange == 0 ? '' : 'text-red-400'}>{#if apeChange > 0}+{/if}{formatter.item(apeChange)}%  <span class={apeChangeAll > 0 ? 'text-green-400' : apeChangeAll == 0 ? '' : 'text-red-400'}>{#if apeChangeAll > 0}+{/if}{formatter.item(apeChangeAll)}%</span></p>
</div>