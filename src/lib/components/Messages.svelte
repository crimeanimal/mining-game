<script>
    // @ts-ignore
    import { messages } from '$lib/stores/message';

    $: filteredMessages = $messages

    /**
     * @param {string} type
     */
    function changeFilter(type) {
        if (type != 'ALL') {
            filteredMessages = $messages.filter(obj => {
                return obj.type === type;
            });
        } else {
            filteredMessages = $messages
        }
    }
</script>

<div class="container w-full">
    <p class="font-bold">Filter messages by type:</p>
    <div class="flex">
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