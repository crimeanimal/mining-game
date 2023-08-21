<script>
    // @ts-ignore
    import { messageStore } from '$lib/stores/message';

    /**
     * @type {{ time: string; content: string; }[]}
     */
    let messages
    messageStore.subscribe((value) => {
        messages = value
    })
</script>

<div class="container w-full">
    <ul>
        {#each messages as message}
            <li>[{message.time}] - {message.content}</li>
        {/each}
    </ul>
</div>