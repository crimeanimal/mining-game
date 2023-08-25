<script>
    import ApeTerminal from '$lib/components/ApeTerminal.svelte';
    import Messages from '$lib/components/Messages.svelte';
    import Mine from '$lib/components/Mine.svelte';
    import Save from '$lib/components/Save.svelte';
    import Store from '$lib/components/Store.svelte';
    import Market from '$lib/components/Market.svelte';
</script>

<svelte:head>
	<title>crimeanimal - Mining Game</title>
</svelte:head>

<div style="height: 100vh;" class="dark:text-gray-100 w-full h-full mx-0 pt-16">
    <div style="height: 100vh;" class="container mx-auto grid md:grid-cols-2 xl:grid-cols-3">
        <Mine />
        <Market />
        <ApeTerminal />
        <Store />
        <Messages />
        <Save />
    </div>
</div>