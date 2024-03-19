<script>
    import Search from '$lib/input/Search.svelte';
    import TeamCard from '$lib/TeamCard.svelte';

    const teams = [
        { name: 'Media Club Service Requisiton', favourites: 46, role: 'Member' },
        { name: 'Chemistry Lab Requisition', favourites: 13, private: true },
        { name: "OPT'24 Logs", favourites: 57, role: 'Member', private: true },
        { name: 'Estate Service Request', favourites: 9 },
        { name: 'PE Dept Equipment Loan', favourites: 28 }
    ]
</script>
<main class="h-full relative">
    <div class="fixed px-4 sm:px-8 pb-2 pt-20 w-full max-w-6xl bg-slate-100/30 dark:bg-slate-950/50 backdrop-blur-xl"><Search/></div>
    <section class="px-4 sm:px-8 pt-32 pb-4">
        <div class="text-sm p-4 text-slate-500">
            Only public teams, and private teams which you have added to your favourites or are a member of are listed.
            <a href="/about#team-visibility" class="underline hover:text-violet-600 hover:dark:text-violet-400">Learn&nbsp;more</a>
        </div>
        <div class="grid md:grid-cols-2 gap-2">
            {#each teams as team }
                <TeamCard {team}/>
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