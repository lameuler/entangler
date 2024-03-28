<script lang="ts">
    import Card from '$lib/Card.svelte';
    import { slide } from 'svelte/transition';
    import DateRange from './DateRange.svelte';
    import Collapsible from './Collapsible.svelte';

    export let request: any

    const status = ['Pending', 'Rejected', 'Approved']
    const statusBg = ['violet','red','green']
</script>

<Card glow="false">
    <a href="/dashboard/{request.t_id}" class="text-sm opacity-60 hover:underline hover:opacity-80">
        { request.team }
    </a>
    <div class="flex">
        <a href="/dashboard/{request.t_id}/{request.req_id}" class="grow text-xl px-2 -mx-2 font-semibold hover:underline">
            { request.name }
        </a>
        <span class="shrink-0 px-2 content-center rounded-full text-white bg-{statusBg[request.status]}-600">
            { status[request.status] }
        </span>
    </div>
    {#if request.description}
    <p class="text-justify text-slate-700 dark:text-slate-300 mt-1">
        { request.description }
    </p>
    {/if}
    {#if request.dates && request.dates.length > 0 }
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
    {#if request.deps && Array.isArray(request.deps) && request.deps.length > 0}
        <Collapsible title="Deployments" length={request.deps.length}>
            <ul>
                {#each request.deps as { start, end, note } }
                    <li class="text-slate-700 dark:text-slate-300 list-disc list-inside ps-1">
                        <DateRange {start} {end}/>
                        {#if note }
                            ({note})
                        {/if}
                    </li>
                {/each}
            </ul>
        </Collapsible>
    {/if}
</Card>