<script>
    // @ts-ignore
    import { messages } from '$lib/stores/message';
</script>

<div class="container w-full">
    <ul>
        {#each $messages as message}
            <li>[{message.time}] - {message.content}</li>
        {/each}
    </ul>
</div>