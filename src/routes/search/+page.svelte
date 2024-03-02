<script>
    import Search from '$lib/Search.svelte';
    import TeamCard from '$lib/TeamCard.svelte';
    import { data } from '$lib/data';

    const names = [
        'Media Club Service Requisiton',
        'Chemistry Lab Requisition',
        "OPT'24 Logs",
        'Estate Service Request',
        'PE Dept Equipment Loan'
    ]
</script>
<main class="h-full relative">
    <div class="fixed px-4 sm:px-8 pb-2 pt-20 w-full max-w-6xl bg-slate-100 dark:bg-slate-950/50 backdrop-blur-xl"><Search/></div>
    <section class="px-4 sm:px-8 pt-32 pb-4">
        <div class="text-sm p-4 text-slate-500">
            Only public teams, and private teams which you have added to your favourites or are a member of are listed.
            <a href="/about#team-visibility" class="underline hover:text-violet-600 hover:dark:text-violet-400">Learn&nbsp;more</a>
        </div>
        <div class="grid md:grid-cols-2 gap-2">
            {#each names as name }
                <TeamCard {name}/>
            {/each}
        </div>
    </section>
</main>

<svelte:head>
    <title>Search | Entangler</title>
</svelte:head>

<!-- <style lang="postcss">
    div.cell {
        @apply px-2 text-ellipsis overflow-clip text-nowrap whitespace-nowrap
    }
</style> -->