<script>
    import "../app.css";
    import WalletInfo from "$lib/components/WalletInfo.svelte";
    import Settings from "$lib/components/Settings.svelte";
    import Ticker from "$lib/components/Ticker.svelte";
</script>


<div class="navbar bg-base-300">
    <div class="flex-1">
        <Ticker />
    </div>
    <div class="flex-none">
        <div class="flex justify-end space-x-2 px-4">
            <WalletInfo />
            <Settings />
        </div>
    </div>
</div>
<slot />