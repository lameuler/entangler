<script lang="ts">
    import ActionLink from '$lib/ActionLink.svelte';
import Card from '$lib/Card.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Markdown from '$lib/display/Markdown.svelte';
    import PageError from '$lib/display/PageError.svelte';
    import FavouritesToggle from '$lib/input/FavouritesToggle.svelte';
    import PageSpinner from '$lib/PageSpinner.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

</script>

<main class="flex flex-col sm:flex-row p-4 sm:p-10 pt-20 gap-6 h-full">
    {#await data.teamPromise }
        <PageSpinner/>
    {:then team }
        {#if team }
            <section class="flex sm:sticky items-center sm:min-w-72 sm:max-w-72 md:min-w-96 md:max-w-96 max-h-screen sm:h-full top-0">
                <div class="relative z-0 w-full sm:w-auto sm:sticky sm:top-20 sm:min-w-72 sm:max-w-72 md:min-w-96 md:max-w-96">
                    <Card>
                        <div class="flex items-center gap-1">
                            <h1 class="text-2xl font-semibold p-1 grow shrink">{ team.name }</h1>
                            <FavouritesToggle favourite={team.fav} favourites={team.favourites} t_id={team.t_id}/>
                        </div>
                        {#if team.description }
                        <p class="p-1 text-justify text-slate-700 dark:text-slate-300">
                            { team.description }
                        </p>
                        {/if}
                        <a href="{window.location.pathname}/request" class="block mt-2 m-0.5 bg-violet-600 text-slate-100 px-3 py-1.5 rounded-md font-medium w-fit">Start request</a>
                    </Card>
                </div>
            </section>
            <section class="grow p-4 w-full self-center mb-4 min-h-48">
                <h2 class="text-2xl sm:mt-4 mb-2 font-semibold">Details</h2>
                {#if team.details }
                    <Markdown markdown={ team.details }/>
                {:else}
                    <span class="opacity-60 px-2 select-none">—</span>
                {/if}
            </section>
        {:else}
            <PageError message={'Team not found'}>
                <ActionLink href="/search">Search all teams</ActionLink>
            </PageError>
        {/if}
    {:catch err}
        <PageError message={err?.message} status={err?.cause?.status}>
            <ActionLink href="/search">Search all teams</ActionLink>
        </PageError>
    {/await}
</main>