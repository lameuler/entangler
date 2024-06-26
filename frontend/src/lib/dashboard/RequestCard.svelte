<script lang="ts">
    import Card from '$lib/Card.svelte';
    import { slide } from 'svelte/transition';
    import DateRange from './DateRange.svelte';
    import Collapsible from './Collapsible.svelte';
    import { createEventDispatcher } from 'svelte';
    import Dropdown from '$lib/input/Dropdown.svelte';
    import { tokenOrGoto } from '$lib/auth';
    import { request as apireq } from '$lib/api'
    import ActionLink from '$lib/ActionLink.svelte';

    export let request: any
    export let showExtra = true
    export let showDate = false
    export let editing = false
    export let manager = false

    const dispatch = createEventDispatcher()


    const statusOptions = ['Pending', 'Rejected', 'Approved']
    const statusBg = ['bg-violet-600','bg-red-600','bg-green-600 dark:bg-green-700']

    let status = 0
    function onUpdate(req: any) {
        status = req.status
    }
    $: onUpdate(request)

    async function onEdit(status: number) {
        if (status !== request.status) {
            dispatch('edit', status)
            const token = await tokenOrGoto()
            await apireq(fetch, '/request/'+request.req_id, token, 'POST', { request: { status } })
        }
    }
    $: onEdit(status)
</script>

<Card glow="false">
    <a href="{ manager ? '/dashboard/' : '/'}{request.t_id}" class="text-sm opacity-60 hover:underline hover:opacity-80">
        { request.team }
    </a>
    <div class="flex flex-wrap gap-x-2 items-center">
        {#if manager}
        <a href="/dashboard/{request.t_id}/{request.req_id}" class="grow text-xl px-2 -mx-2 font-semibold hover:underline">
            { request.name }
        </a>
        {:else}
        <span class="grow text-xl px-2 -mx-2 font-semibold">
            { request.name }
        </span>
        {/if}
        {#if editing}
        <div class="w-32 z-10">
            <Dropdown bind:selected={status} options={statusOptions}/>
        </div>
        {:else}
        <span class="shrink-0 h-fit px-2 mb-1 content-center rounded-full text-white {statusBg[request.status]}">
            { statusOptions[request.status] }
        </span>
        {/if}
    </div>
    <p class="text-sm opacity-60 mt-1">
        {request.user}{#if request.committee},
            {request.committee}
        {/if}
    </p>
    {#if showDate}
        <p class="text-sm opacity-60">{ (new Date(request.date)).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' }) }</p>
    {/if}
    {#if request.description}
    <p class="text-justify text-slate-700 dark:text-slate-300 mt-1 line-clamp-3 overflow-ellipsis">
        { request.description }
    </p>
    {/if}
    {#if request.items && request.items.length > 0 }
        <ul class="flex flex-wrap gap-1 mt-2">
            <span class="font-semibold px-1">Items:</span>
            {#each request.items as item}
                <li class="px-3 bg-slate-300/50 dark:bg-slate-600/50 rounded-full">
                    {item.count} x <span class="font-medium">{item.item}</span>
                </li>
            {/each}
        </ul>
    {/if}
    {#if request.services && request.services.length > 0 }
        <ul class="flex flex-wrap gap-1 mt-2">
            <span class="font-semibold px-1">Services:</span>
            {#each request.services as service}
                <li class="px-3 bg-slate-300/50 dark:bg-slate-600/50 rounded-full font-medium">
                    {service.service}
                </li>
            {/each}
        </ul>
    {/if}
    {#if request.dates && request.dates.length > 0 && showExtra }
        <Collapsible title="Dates" length={request.dates.length}>
            <ul>
                {#each request.dates as { start, end, description } }
                    <li class="text-slate-700 dark:text-slate-300 list-disc list-inside ps-1">
                        <DateRange {start} {end}/>
                        {#if description }
                            ({description})
                        {/if}
                    </li>
                {/each}
            </ul>
        </Collapsible>
    {/if}
    {#if request.deps && Array.isArray(request.deps) && request.deps.length > 0 && showExtra }
        <Collapsible title="Deployments" length={request.deps.length}>
            <ul>
                {#each request.deps as { dep_id, start, end, note } }
                    <li class="text-slate-700 dark:text-slate-300 list-disc list-inside ps-1" class:py-0.5={manager}>
                        <DateRange {start} {end}/>
                        {#if note }
                            <span class="pe-2">({note})</span>
                        {/if}
                        {#if manager}
                            <ActionLink href="/dashboard/{request.t_id}/{request.req_id}/{dep_id}">Edit</ActionLink>
                        {/if}
                    </li>
                {/each}
            </ul>
        </Collapsible>
    {/if}
</Card>