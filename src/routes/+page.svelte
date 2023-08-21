<script>
    import ApeTerminal from '$lib/components/ApeTerminal.svelte';
    import Messages from '$lib/components/Messages.svelte';
import Mine from '$lib/components/Mine.svelte';
    import Sell from '$lib/components/Sell.svelte';
    import Store from '$lib/components/Store.svelte';
</script>

<div style="height: 100vh;" class="dark:text-gray-100 w-full h-full mx-0">
    <div style="height: 100vh;" class="container mx-auto grid md:grid-cols-2 xl:grid-cols-3">
        <Mine />
        <Sell />
        <Store />
        <ApeTerminal />
        <Messages />
    </div>
</div>