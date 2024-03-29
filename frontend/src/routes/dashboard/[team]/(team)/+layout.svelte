<script lang="ts">
    import { goto, pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import Card from '$lib/Card.svelte';
    import ErrorAlert from '$lib/ErrorAlert.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import LinkButton from '$lib/input/LinkButton.svelte';
    import { join } from '$lib/utils';
    import { crumbs } from '../../crumb';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
    const path = $page.url.pathname

    data.teamPromise.then(team => {
        if (team.role < 1) { // redirect to public page if not manager or owner
            goto('/'+team.t_id, { replaceState: true })
        }
        $crumbs = [{ name: team.name }]
    }).catch(console.log)
</script>

<main>
    {#await data.teamPromise }
        <Spinner/>
    {:then team }
        {#if !team }
            <ErrorAlert error="null"/>
        {:else if team.role > 0}
            <section class="">
                <Card glow="false">
                    <div class="">
                        <h1 class="text-2xl font-semibold p-1">{ team.name }</h1>
                    </div>
                    {#if team.description }
                    <p class="p-1 text-justify text-slate-700 dark:text-slate-300">
                        { team.description }
                    </p>
                    {/if}
                    <LinkButton href={join(path, 'details')}>Edit details</LinkButton>
                    <LinkButton href={join(path, 'members')}>View members</LinkButton>
                    <LinkButton href="{window.location.pathname}/items">Manage items</LinkButton>
                    <LinkButton href="{window.location.pathname}/services">Manage services</LinkButton>
                </Card>
            </section>
            <section class="grow p-4 self-center mb-4 min-h-48">
            </section>
        {/if}
    {:catch err}
        {#if err?.status === 404 }
            <div>Team not found</div>
        {:else}
            <ErrorAlert/>
        {/if}
    {/await}
</main>
<slot/>