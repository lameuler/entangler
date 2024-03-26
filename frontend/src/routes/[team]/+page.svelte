<script lang="ts">
    import Card from '$lib/Card.svelte';
    import ErrorAlert from '$lib/ErrorAlert.svelte';
    import Glow from '$lib/Glow.svelte';
    import Markdown from '$lib/Markdown.svelte';
    import PageSpinner from '$lib/PageSpinner.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    const markdown = "https://ler.sg \n\n1. hello\n# whattt \n## heyyy \n### damnn\n what the hello\n\n #### ehhhh \n ##### is this real \n ###### walao \n ####### gg **hi** ~~heyyy~~ *hohoho*"
</script>

<main class="flex flex-col sm:flex-row p-4 sm:p-10 pt-20 gap-6 h-full">
    {#await data.teamPromise }
        <PageSpinner/>
    {:then team }
        {#if team }
            <section class="flex sm:sticky items-center sm:min-w-72 sm:max-w-72 md:min-w-96 md:max-w-96 max-h-screen h-full top-0">
                <div class="relative sm:sticky sm:top-20 sm:min-w-72 sm:max-w-72 md:min-w-96 md:max-w-96">
                    <Card>
                        <div class="">
                            <h1 class="text-2xl font-semibold p-1">{ team.name }</h1>
                        </div>
                        <p class="p-1 text-justify text-slate-700 dark:text-slate-300">
                            { team.description }
                        </p>
                        <a href="{window.location.pathname}/request" class="block mt-2 m-0.5 bg-violet-600 text-slate-100 px-3 py-1.5 rounded-md font-medium w-fit">Start request</a>
                    </Card>
                </div>
            </section>
            <section class="grow p-4 self-center mb-4 min-h-48">
                <h2 class="text-2xl sm:mt-4 mb-2 font-semibold">Details</h2>
                {#if team.details }
                    <Markdown markdown={ team.details }/>
                {:else}
                    <span class="opacity-60 px-2 select-none">—</span>
                {/if}
            </section>
        {:else}
            <ErrorAlert error="null"/>
        {/if}
    {:catch err}
        {#if err?.status === 404 }
            <div>Team not found</div>
        {:else}
            <ErrorAlert/>
        {/if}
    {/await}
</main>