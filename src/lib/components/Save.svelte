<script>
    import { messages } from '$lib/stores/message';
    import { player } from '$lib/stores/player';
    import { save } from '$lib/stores/save';

    /**
     * @type {any}
     */
    let playerObj
    let inputValue = ''
    $: if (inputValue != '') {
        playerObj = JSON.parse(atob(inputValue))
    }

    function loadPlayerState() {
        $player = playerObj
        messages.newMessage('STATE', 'Player state loaded')
    }
</script>

<div class="container px-4 gap-2 grid grid-cols-2">
    <div>
        <button on:click={save.playerObjToB64} class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
            Save state
        </button>
        {#if $save != ''}
            <p class="font-bold">Encoded player state:</p>
            <p class='break-words'>{$save}</p>
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
            <p>{JSON.stringify(playerObj, null, 2)}</p>
        {/if}
    </div>
</div>