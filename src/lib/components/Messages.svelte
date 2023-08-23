<script>
    // @ts-ignore
    import { messages } from '$lib/stores/message';
    import { player } from '$lib/stores/player'

    let filterType = 'ALL'
    $: filteredMessages = changeFilter(filterType)

    /**
     * @param {string} type
     */
    function changeFilter(type) {
        if (type != 'ALL') {
            filterType = type
            return $messages.filter(obj => {
                return obj.type === type;
            });
        } else {
            filterType = 'ALL'
            return $messages
        }
    }
</script>

<div class="container w-full">
    <p class="font-bold">Filter messages by type: {filterType}</p>
    <div class="flex">
        {#if $player.dogs.amount >0}
            <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => changeFilter('DOGS')}>dogs</button>
        {/if}
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => changeFilter('APES')}>apes</button>
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => changeFilter('ORE')}>ore</button>
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => changeFilter('STATE')}>state</button>
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => changeFilter('GREETING')}>greeting</button>
        <button class="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800" on:click={() => changeFilter('ALL')}>all</button>
    </div>
    <ul>
        {#each filteredMessages as message}
            <li>[{message.time}] - {message.type} - {message.content}</li>
        {/each}
    </ul>
</div>