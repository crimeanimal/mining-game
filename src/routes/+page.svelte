<script>
    import Messages from '$lib/components/Messages.svelte';
import Mine from '$lib/components/Mine.svelte';
    import Sell from '$lib/components/Sell.svelte';
    import Store from '$lib/components/Store.svelte';
</script>

<div class="container mx-auto grid md:grid-cols-2 xl:grid-cols-3">
    <Mine />
    <Sell />
    <Store />
    <Messages />
</div>