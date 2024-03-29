<script lang="ts">
    import { goto, pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import ActionLink from '$lib/ActionLink.svelte';
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

<main class="py-4">
    {#await data.teamPromise }
        <Spinner/>
    {:then team }
        {#if !team }
            <ErrorAlert error="null"/>
        {:else if team.role > 0}
            <section class="grid grid-rows-[auto-auto] sm:grid-cols-[1fr_auto] gap-4 z-0 relative" aria-hidden={$page.route.id !== '/dashboard/[team]/(team)'}>
                <Card glow="false">
                    <div class="flex flex-wrap items-center">
                        <h1 class="text-2xl font-semibold p-1 grow">{ team.name }</h1>
                        {#if team.handle}
                            <a href="/@{team.handle}" class="p-1 opacity-60 hover:opacity-80 hover:underline">@{team.handle}</a>
                        {/if}
                    </div>
                    {#if team.description }
                    <p class="p-1 text-justify text-slate-700 dark:text-slate-300 mb-2">
                        { team.description }
                    </p>
                    {/if}
                    <div class="flex gap-4">
                        <LinkButton href="/dashboard/{team.t_id}/details">Edit details</LinkButton>
                        <ActionLink href="/{team.t_id}">View page</ActionLink>
                    </div>
                </Card>
                <Card>
                    <div class="flex flex-col gap-1.5 h-min px-1 pt-1">
                        <h2 class="text-xl font-semibold lg:me-8">Manage team</h2>
                        <ActionLink href="/dashboard/{team.t_id}/members">View members</ActionLink>
                        <ActionLink href="/dashboard/{team.t_id}/items">Manage items</ActionLink>
                        <ActionLink href="/dashboard/{team.t_id}/services">Manage services</ActionLink>
                    </div>
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