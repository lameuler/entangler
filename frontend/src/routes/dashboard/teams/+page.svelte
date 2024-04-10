<script lang="ts">
    import ActionLink from '$lib/ActionLink.svelte';
    import { search } from '$lib/api';
    import SearchLayout from '$lib/dashboard/SearchLayout.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import LinkButton from '$lib/input/LinkButton.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import TeamCard from '$lib/display/TeamCard.svelte'
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
                    <TeamCard {team} base={ team.role > 1 ? '/dashboard/' : '/'}/>
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
    <div class="self-end fixed p-1 rounded-xl bottom-12 bg-slate-50/30 dark:bg-slate-950/30 backdrop-blur-sm shadow-x">
        <LinkButton href="/dashboard/teams/create">
            <svg viewBox="0 0 24 24" class="icon w-5 h-5">
                <path d="M12 5l0 14" /><path d="M5 12l14 0" />
            </svg>
            Create Team
        </LinkButton>
    </div>
</SearchLayout>

<svelte:head>
    <title>Teams | Entangler</title>
</svelte:head>