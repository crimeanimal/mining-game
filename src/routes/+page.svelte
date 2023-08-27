<script>
    import ApeTerminal from '$lib/components/ApeTerminal.svelte';
    import Messages from '$lib/components/Messages.svelte';
    import Mine from '$lib/components/Mine.svelte';
    import Save from '$lib/components/Save.svelte';
    import Store from '$lib/components/Store.svelte';
    import Market from '$lib/components/Market.svelte';

    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';

    onMount(() => {
        let el = document.getElementById("items")
        let sortable = Sortable.create(el);
    })
</script>

<svelte:head>
	<title>crimeanimal - Mining Game</title>
</svelte:head>

<div class="p-24">
    <ul id="items" class="container mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-12">
        <li><Mine /></li>
        <li><Market /></li>
        <li><ApeTerminal /></li>
        <li><Store /></li>
        <li><Messages /></li>
        <li><Save /></li>
    </ul>
</div>