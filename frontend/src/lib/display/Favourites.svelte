<script lang="ts">
    import Spinner from '$lib/Spinner.svelte';
    import { onMount } from 'svelte';
    import Card from '../Card.svelte';
    import ErrorAlert from './ErrorAlert.svelte';
    import { tokenOrNullGoto } from '$lib/auth';
    import { getTeams } from '$lib/api';
    import ActionLink from '$lib/ActionLink.svelte';

    let favourites: Promise<{ teams: any[]}> | undefined = undefined

    onMount(async () => {
        const token = await tokenOrNullGoto()
        if (token) {
            favourites = getTeams(fetch, token, undefined, 'favourite')
        } else {
            favourites = undefined
        }
    })
</script>

<Card glow=false>
    <div class="flex items-center gap-2">
        <h2 class="font-medium text-xl">
            Favourites
        </h2>
        <svg class="icon h-5 w-5 text-amber-400" viewBox="0 0 24 24">
            <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
        </svg>
        <div class="grow"/>
        <a class="text-violet-600 dark:text-violet-400" href="/search?filter=favourite">View all</a>
    </div>
    <div class="flex flex-col gap-0.5 py-0.5">
        {#if favourites}
            {#await favourites}
                <Spinner/>
            {:then result }
                {#if Array.isArray(result.teams)}
                    {#each result.teams.slice(0,5) as team}
                        <ActionLink href="/{team.t_id}">{team.name}</ActionLink>
                    {:else}
                        <p class="text-slate-500 mt-1">No favourites saved</p>
                    {/each}
                {:else}
                    <ErrorAlert/>
                {/if}
            {:catch}
                <ErrorAlert/>
            {/await}
        {:else}
        <p class="text-slate-500 mt-1">Login to save favourites</p>
        {/if}
    </div>
</Card>