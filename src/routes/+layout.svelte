<script>
    import "../app.css";
    import {onMount} from 'svelte';
    import fast_car from '$lib/music/fast_car.mp3'
    import { settingsStore } from "$lib/stores/settings";
    import { oreStore } from "$lib/stores/ore";
    import { orePriceHistoryStore } from "$lib/stores/ore";
    import { apePriceStore, apePriceHistoryStore } from "$lib/stores/ape";
    import { walletStore } from "$lib/stores/wallet";
    import { playerStore } from "$lib/stores/player";
    import bayc1 from '$lib/images/bayc1.webp'
    import bayc2 from '$lib/images/bayc2.webp'
    import bayc3 from '$lib/images/bayc3.webp'
    import bayc4 from '$lib/images/bayc4.webp'
    import bayc5 from '$lib/images/bayc5.webp'
    import broke from '$lib/images/broke.gif'

    let bayc = [bayc1,bayc2,bayc3,bayc4,bayc5]

    function connectWallet() {
        walletStore.update((wallet) => {
            wallet.connected = true
            return wallet
        })
    }

    /**
     * @type {{ sounds: boolean, music: boolean }}
     */
    let settings
    settingsStore.subscribe((value) => {
        settings = value
    })

    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; apes: number; }}
     */
     let player
    playerStore.subscribe((value) => {
        player = value
    })

    /**
     * @type {{ connected: boolean; }}
     */
    let wallet
    walletStore.subscribe((value) => {
        wallet = value
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
    let orePriceHistory
    orePriceHistoryStore.subscribe((value) => {
		orePriceHistory = value;
	});

    /**
     * @type {number}
     */
    let apePrice
    apePriceStore.subscribe((value) => {
		apePrice = value;
	});
    /**
     * @type {number[]}
     */
    let apePriceHistory
    apePriceHistoryStore.subscribe((value) => {
		apePriceHistory = value;
	});

    function toggleSound() {
        settingsStore.update((currentSettings) => {
            currentSettings.sounds = !currentSettings.sounds
            return currentSettings
        })
    }

    function toggleMusic() {
        settingsStore.update((currentSettings) => {
            currentSettings.music = !currentSettings.music
            return currentSettings
        })
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
    $: if (orePriceHistory.length > ticks) {
            oreChange = getPercentageChange([...orePriceHistory].slice(-ticks)[0], orePrice)*-1
            console.log([...orePriceHistory].slice(-ticks)[0], orePrice, oreChange)
        } else {
            oreChange = getPercentageChange(orePriceHistory[0], orePrice)*-1
            console.log(orePriceHistory[0], orePrice, oreChange)
        }

    /**
     * @type {number | bigint}
     */
    let apeChange
    $: if (apePriceHistory.length > ticks) {
            apeChange = getPercentageChange([...apePriceHistory].slice(-(ticks))[0], apePrice)*-1
            console.log([...apePriceHistory].slice(-(ticks))[0], apePrice, apeChange)
        } else {
            apeChange = getPercentageChange(apePriceHistory[0], apePrice)*-1
            console.log(apePriceHistory[0], apePrice, apeChange)
        }

    /**
     * @type {HTMLAudioElement}
     */
    let fastCarAudio

    $: if (settings.music && fastCarAudio != undefined) {
        fastCarAudio.play();
    } else if (settings.music == false && fastCarAudio != undefined) {
        fastCarAudio.pause();
    }

    onMount(() => {
        if (settings.music) {
            fastCarAudio = new Audio(fast_car)
            fastCarAudio.volume = 0.2
            fastCarAudio.loop = true
            fastCarAudio.play();
        }
    })
</script>


<div class="fixed w-full dark:text-gray-100 dark:bg-slate-700 grid grid-cols-2">
    <div class="flex justify-start content-end">
        <p class="font-bold leading-relaxed px-4 text-3xl">Ore: ₥{stuffFormatter.format(orePrice)} <span class={oreChange > 0 ? 'text-green-400' : oreChange == 0 ? '' : 'text-red-400'}>{#if oreChange > 0}+{/if}{stuffFormatter.format(oreChange)}%</span></p>
        <p class="font-bold leading-relaxed px-4 text-3xl">Apes: ₥{stuffFormatter.format(apePrice)} <span class={apeChange > 0 ? 'text-green-400' : apeChange == 0 ? '' : 'text-red-400'}>{#if apeChange > 0}+{/if}{stuffFormatter.format(apeChange)}%</span></p>
    </div>
    <div>
        <nav class="flex justify-end space-x-2 px-4">
            <div>
                {#if wallet.connected}
                    <div class="flex gap-3 pt-2">
                        <img class='h-10 w-10 rounded-full ring-2 ring-gray-100' src={player.apes > 0 ? bayc[Math.floor(Math.random() * bayc.length)] : broke} alt="">
                        <div class="self-center">
                            <p>0xf4rt_buck3t connected</p>
                            <p class="text-xs">{player.apes} ape{#if player.apes != 1 }s{/if}</p>
                        </div>
                    </div>
                {:else}
                    <button class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={connectWallet}>Connect Wallet</button>
                {/if}
            </div>
            <button on:click={toggleSound} class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
                {#if settings.sounds}
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
                {#if settings.music}
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