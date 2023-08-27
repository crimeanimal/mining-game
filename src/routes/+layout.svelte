<script>
    import "../app.css";
    import WalletInfo from "$lib/components/WalletInfo.svelte";
    import Settings from "$lib/components/Settings.svelte";
    import Ticker from "$lib/components/Ticker.svelte";
</script>


<div class="fixed w-full dark:text-gray-100 dark:bg-slate-700 flex">
    <Ticker />
    <div class="">
        <nav class="flex justify-end space-x-2 px-4">
            <WalletInfo />
            <Settings />
        </nav>
    </div>
</div>
<slot />