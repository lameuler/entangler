<script lang="ts">
    import { goto } from '$app/navigation';
    import ActionLink from '$lib/ActionLink.svelte';
    import { encodeParam } from '$lib/api';
    import ErrorAlert from '$lib/ErrorAlert.svelte';
import Search from '$lib/input/Search.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import TeamCard from '$lib/TeamCard.svelte';
    import type { PageData } from './$types';

    export let data: PageData

    function search(q?: string|null) {
        if (q)
            goto('/search?q='+(encodeParam(q)))
        else
            goto('/search')
    }

</script>
<main class="h-full relative">
    <div class="fixed px-4 sm:px-8 pb-2 pt-20 w-full max-w-6xl bg-slate-100/30 dark:bg-slate-950/50 backdrop-blur-xl">
        <Search value={ data.q ?? '' } on:search={ ({ detail })=>search(detail) } on:reset={ ()=>search()}/>
    </div>
    <section class="px-4 sm:px-8 pt-32 pb-4">
        {#await data.teamsPromise }
            <div class="p-8 w-full flex justify-center">
                <Spinner/>
            </div>
        {:then result }
            {#if result }
                <div class="text-sm p-4 text-slate-500">
                    Only public teams, and private teams which you have added to your favourites or are a member of are listed.
                    <a href="/about#team-visibility" class="underline hover:text-violet-600 hover:dark:text-violet-400">Learn&nbsp;more</a>
                </div>
                <div class="grid md:grid-cols-2 gap-2">
                    {#each result.teams as team }
                        <TeamCard {team}/>
                    {:else}
                        <div class="col-span-full text-center p-8 text-slate-700 dark:text-slate-300">
                            No matching teams found.<br/>
                            <ActionLink href="/dashboard/teams/create">Create your own</ActionLink>
                        </div>
                    {/each}
                </div>
            {:else}
                <ErrorAlert/>
            {/if}
        {:catch}
            <ErrorAlert/>
        {/await}
    </section>
</main>

<svelte:head>
    <title>Search | Entangler</title>
</svelte:head>