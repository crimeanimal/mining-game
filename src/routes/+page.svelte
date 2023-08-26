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

<div style="height: 100vh;" class="dark:text-gray-100 w-full h-full mx-0 pt-16">
    <ul id="items" style="height: 100vh;" class="container mx-auto grid md:grid-cols-2 xl:grid-cols-3">
        <li><Mine /></li>
        <li><Market /></li>
        <li><ApeTerminal /></li>
        <li><Store /></li>
        <li><Messages /></li>
        <li><Save /></li>
    </ul>
</div>