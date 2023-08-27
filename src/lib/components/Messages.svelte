<script>
    import { messages } from '$lib/stores/message';
    import { player } from '$lib/stores/player'

    let filterType = 'ALL'
    let filteredMessages = $messages

    $: if (filterType != 'ALL') {
        filteredMessages = [...$messages].filter(obj => obj.type === filterType)
    } else {
        filteredMessages = $messages
    }

</script>

<div class="card w-full bg-base-200 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Filter messages by type: {filterType}</h2>
        <div class="flex flex-wrap">
            {#if $player.dogs.amount >0}
                <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => filterType = 'DOGS'}>dogs</button>
            {/if}
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => filterType = 'APES'}>apes</button>
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => filterType = 'ORE'}>ore</button>
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => filterType = 'STATE'}>state</button>
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => filterType = 'GREETING'}>greeting</button>
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => filterType = 'ALL'}>all</button>
        </div>
        <ul>
            {#each filteredMessages as message}
                <li>[{message.time}] - {message.type} - {message.content}</li>
            {/each}
        </ul>
    </div>
</div>