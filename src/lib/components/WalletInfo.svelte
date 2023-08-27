<script>
    import { wallet } from "$lib/stores/wallet";
    import { player } from "$lib/stores/player";
    import bayc1 from '$lib/images/bayc1.webp'
    import bayc2 from '$lib/images/bayc2.webp'
    import bayc3 from '$lib/images/bayc3.webp'
    import bayc4 from '$lib/images/bayc4.webp'
    import bayc5 from '$lib/images/bayc5.webp'
    import broke from '$lib/images/broke.gif'
    let bayc = [bayc1,bayc2,bayc3,bayc4,bayc5]
    let profilePic = bayc[Math.floor(Math.random() * bayc.length)]

    
    function connectWallet() {
        $wallet.connected = true
    }
</script>

<div>
    {#if $wallet.connected}
        <div class="flex gap-3 pt-2">
            <img class='h-10 w-10 rounded-full ring-2 ring-gray-100' src={$player.apes > 0 ? profilePic : broke} alt="">
            <div class="self-center">
                <p>0xf4rt_buck3t connected</p>
                <p class="text-xs">{$player.apes} ape{#if $player.apes != 1 }s{/if}</p>
            </div>
        </div>
    {:else}
        <button class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={connectWallet}>Connect Wallet</button>
    {/if}
</div>