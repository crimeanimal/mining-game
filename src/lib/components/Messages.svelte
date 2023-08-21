<script>
    // @ts-ignore
    import { messageStore } from '$lib/stores/message';


    /**
     * @type {any}
     */
    let messages
    messageStore.subscribe((/** @type {any} */ value) => {
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