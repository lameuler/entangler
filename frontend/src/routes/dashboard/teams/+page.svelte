<script lang="ts">
    import ActionLink from '$lib/ActionLink.svelte';
    import { search } from '$lib/api';
    import SearchLayout from '$lib/dashboard/SearchLayout.svelte';
    import ErrorAlert from '$lib/ErrorAlert.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import TeamCard from '$lib/TeamCard.svelte'
    import { crumbs } from '../crumb';
    import type { PageData } from './$types';
    
    export let data: PageData;

    const options = [['Manager', 'Owner'], ['Favourite']]

    $crumbs = [{ name: 'Teams', path: '/dashboard/teams' }]
</script>

<SearchLayout q={data.q ?? ''} search={ (q, filter)=>search('/dashboard/teams', q, filter)} {options} filter={data.filter ?? ''}>
    {#await data.teamsPromise }
        <Spinner/>
    {:then result }
        {#if result }
            <div class="text-sm px-4 text-slate-500">
                Only teams you are a member of are listed.
                <a href="/search{ data.q ? '?q='+data.q : '' }" class="underline hover:text-violet-600 hover:dark:text-violet-400">Search all teams</a>
            </div>
            <div class="grid gap-2">
                {#each result.teams as team }
                    <TeamCard {team} base="/dashboard/"/>
                {:else}
                    <div class="col-span-full text-center p-8 text-slate-700 dark:text-slate-300">
                        No matching teams found.<br/>
                        <ActionLink href="/dashboard/teams/create">
                            Create your own
                        </ActionLink>
                    </div>
                {/each}
            </div>
        {:else}
            <ErrorAlert/>
        {/if}
    {:catch}
        <ErrorAlert/>
    {/await}
</SearchLayout>