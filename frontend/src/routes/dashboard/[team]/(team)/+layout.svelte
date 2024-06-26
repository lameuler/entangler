<script lang="ts">
    import { goto, pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import ActionLink from '$lib/ActionLink.svelte';
    import Card from '$lib/Card.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import LinkButton from '$lib/input/LinkButton.svelte';
    import { join } from '$lib/utils';
    import { crumbs } from '../../crumb';
    import type { LayoutData } from './$types';
    import PageError from '$lib/display/PageError.svelte';
    import RequestCard from '$lib/dashboard/RequestCard.svelte';
    
    export let data: LayoutData;
</script>

<main class="py-4">
    {#await data.teamPromise }
        <Spinner/>
    {:then team }
        {#if team?.role > 0 }
            <section class="grid grid-rows-[auto-auto] sm:grid-cols-[1fr_auto] gap-4 z-10 relative" aria-hidden={$page.route.id !== '/dashboard/[team]/(team)'}>
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
            <section class="py-4 flex flex-col gap-2 mt-4">
                <div class="flex justify-between px-2">
                    <h2 class="text-xl font-semibold">Pending Requests</h2>
                    <ActionLink href="/dashboard/{team.t_id}/requests">View all requests</ActionLink>
                </div>
                {#await data.requestsPromise}
                    <Spinner/>
                {:then result}
                    {#if Array.isArray(result.requests)}
                        {#each result.requests.slice(0,4) as request}
                            <RequestCard {request} manager/>
                        {:else}
                            <p class="text-slate-700 dark:text-slate-300 mt-2">No pending requests</p>
                        {/each}
                    {:else}
                        <ErrorAlert/>
                    {/if}
                {:catch}
                    <ErrorAlert/>
                {/await}
            </section>
            <slot/>
        {:else}
            <PageError message="Team not found"/>
        {/if}
    {:catch err}
        <PageError status={err?.cause?.status} message={err?.message}/>
    {/await}
</main>

<svelte:head>
    {#await data.teamPromise }
        <title>Entangler</title>
    {:then team }
        {#if team?.name }
            <title>{ team.name } | Entangler</title>
        {:else}
            <title>Not found | Entangler</title>
        {/if}
    {:catch err}
        {#if err?.cause?.status === 404 }
            <title>Not found | Entangler</title>
        {:else}
            <title>Error | Entangler</title>
        {/if}
    {/await}
</svelte:head>