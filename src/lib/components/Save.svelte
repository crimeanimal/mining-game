<script>
    import { messageStore } from '$lib/stores/message';
    import { playerStore } from '$lib/stores/player';

    /**
     * @type {{ ore: number; monie: number; pick_upgrades: number; level: number;}}
     */
    let player
    playerStore.subscribe((value) => {
        player = value
    })

    let playerBase64 = ''
    /**
     * @type {any}
     */
    let playerObj
    let inputValue = ''
    $: if (inputValue != '') {
        playerObj = JSON.parse(atob(inputValue))
    }

    $: console.log(playerBase64)

    function playerObjToB64() {
        playerBase64 = btoa(JSON.stringify(player))
        navigator.clipboard.writeText(playerBase64).then(() => {
            console.log('Content copied to clipboard');
            addMessage('Player state copied to clipboard')
            /* Resolved - text copied to clipboard successfully */
            },() => {
            console.error('Failed to copy');
            addMessage('Player state failed to save')
            /* Rejected - text failed to copy to the clipboard */
        });
    }

    function loadPlayerState() {
        playerStore.update((player) => {
            player = playerObj
            return player
        })
        addMessage('Player state loaded')
    }

    /**
     * @param {any} content
     */
    function addMessage(content) {
        let message = {
            time: new Date().toLocaleTimeString(),
            content: content
        }
        messageStore.update((/** @type {any} */ messages) => {
            return [message, ...messages]
        })
    }
</script>

<div class="container px-4 gap-2 grid grid-cols-2">
    <div>
        <button on:click={playerObjToB64} class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
            Save state
        </button>
        {#if playerBase64 != ''}
            <p class="font-bold">Encoded player state:</p>
            <p class='break-words'>{playerBase64}</p>
        {/if}
    </div>
    <div>
        <div class="relative flex flex-wrap items-stretch">
            <input class="flex-auto bg-gray-700 focus:bg-gray-700" type="text" bind:value={inputValue} />
            <button on:click={loadPlayerState} class="flex-auto items-center h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
                Load state
            </button>
        </div>
        {#if playerObj != undefined}
            {#each Object.keys(playerObj) as key}
                <p>{key}: {playerObj[key]}</p>
            {/each}
        {/if}
    </div>
</div>