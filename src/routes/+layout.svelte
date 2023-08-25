<script>
    import "../app.css";
    import {onMount} from 'svelte';
    import fast_car from '$lib/music/fast_car.mp3'
    import human from '$lib/music/human.mp3'
    import virtual_insanity from '$lib/music/virtual_insanity.mp3'
    import { settings } from "$lib/stores/settings";
    import { ore } from "$lib/stores/ore";
    import { ape } from "$lib/stores/ape";
    import { wallet } from "$lib/stores/wallet";
    import { player } from "$lib/stores/player";
    import bayc1 from '$lib/images/bayc1.webp'
    import bayc2 from '$lib/images/bayc2.webp'
    import bayc3 from '$lib/images/bayc3.webp'
    import bayc4 from '$lib/images/bayc4.webp'
    import bayc5 from '$lib/images/bayc5.webp'
    import broke from '$lib/images/broke.gif'
    import { formatter } from "$lib/formatter";

    let bayc = [bayc1,bayc2,bayc3,bayc4,bayc5]
    let profilePic = bayc[Math.floor(Math.random() * bayc.length)]
    let songs = [fast_car,human,virtual_insanity]

    function connectWallet() {
        $wallet.connected = true
    }

    function toggleSound() {
        $settings.sounds = !$settings.sounds
    }

    function toggleMusic() {
        $settings.music = !$settings.music
    }

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

    /**
     * @type {HTMLAudioElement}
     */
    let musicAudio

    $: if ($settings.music && musicAudio != undefined) {
        musicAudio.play();
    } else if ($settings.music == false && musicAudio != undefined) {
        musicAudio.pause();
    }

    function playNewSong() {
        if ($settings.music) {
            musicAudio = new Audio(songs[Math.floor(Math.random() * songs.length)])
            musicAudio.volume = 0.2
            musicAudio.play();
        }
    }

    onMount(() => {
        playNewSong()
    })

    $: if (musicAudio != undefined) {
        musicAudio.onended = function() {
            playNewSong()
        }; 
    }
</script>


<div class="fixed w-full dark:text-gray-100 dark:bg-slate-700 grid grid-cols-2">
    <div class="flex justify-start content-end">
        <p class="font-bold leading-relaxed px-4 text-3xl">Ore: {formatter.currency($ore.price)} <span class={oreChange > 0 ? 'text-green-400' : oreChange == 0 ? '' : 'text-red-400'}>{#if oreChange > 0}+{/if}{stuffFormatter.format(oreChange)}%</span></p>
        <p class="font-bold leading-relaxed px-4 text-3xl">Apes: {formatter.currency($ape.price)} <span class={apeChange > 0 ? 'text-green-400' : apeChange == 0 ? '' : 'text-red-400'}>{#if apeChange > 0}+{/if}{stuffFormatter.format(apeChange)}%</span></p>
    </div>
    <div>
        <nav class="flex justify-end space-x-2 px-4">
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
            <button on:click={toggleSound} class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
                {#if $settings.sounds}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>                  
                {/if}
            </button>
            <button on:click={toggleMusic} class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
                {#if $settings.music}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>          
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>                        
                {/if}
            </button>
        </nav>
    </div>
</div>
<slot />