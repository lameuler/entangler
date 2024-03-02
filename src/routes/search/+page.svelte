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
    <div class="fixed px-8 pb-2 pt-20 w-full max-w-6xl bg-slate-100 dark:bg-slate-950/50 backdrop-blur-xl"><Search/></div>
    <!-- <div class="mt-4 h-full w-full relative">
        <div class="h-full w-full absolute overflow-y-auto rounded-lg bg-gray-200 dark:bg-gray-900 border-gray-200 dark:border-gray-900 border-t">
            <div class="flex h-10 border-b border-slate-500 px-1 sticky top-0 bg-gray-200 dark:bg-gray-900 w-full min-w-[40rem] font-medium">
                <div class="cell w-28 max-w-28 py-2">Date</div>
                <div class="cell w-[30%] max-w-[30%] py-2">Email</div>
                <div class="cell w-[50%] grow py-2">Message</div>
            </div>
            {#each data as entry}
            <div class="flex h-8 border-b border-slate-500/60 px-1 items-center min-w-[40rem] text-sm">
                
                <div class="cell w-28 max-w-28">{
                    Intl.DateTimeFormat('en-SG', { dateStyle: 'medium', timeStyle: undefined, timeZone: 'Singapore'}).format(entry.date)
                    }</div>
                </!-- <div class="cell w-[30%] max-w-[30%]">{entry.name}</div> --/>
                <div class="cell w-[30%] max-w-[30%]">{entry.email}</div>
                <div class="cell w-[50%] grow">{entry.message}</div>
                
            </div>
            {/each}
        </div>
    </div> -->
    <section class="p-8 pt-32">
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