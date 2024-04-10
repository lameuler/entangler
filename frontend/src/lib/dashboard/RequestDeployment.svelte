<script lang="ts">
    import { goto } from '$app/navigation';
    import Card from '$lib/Card.svelte';
    import Button from '$lib/input/Button.svelte';
    import DateRangeInput from '$lib/input/DateRangeInput.svelte';
    import LinkButton from '$lib/input/LinkButton.svelte';
    import TextInput from '$lib/input/TextInput.svelte';
    import { createEventDispatcher } from 'svelte';
    import DateRange from './DateRange.svelte';
    import { request } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';

    export let deployment: any
    export let edit: boolean = false

    let id = deployment.dep_id
    let start = new Date(deployment.start)
    let end = new Date(deployment.end)
    let deleting = false
    let saving = false
    let error = false

    const dispatch = createEventDispatcher()

    $: update(deployment)

    function update(dep: any) {
        if (dep.dep_id !== id) {
            id = dep.dep_id
            start = new Date(dep.start)
            end = new Date(dep.end)
            deleting = false
        }
    }

    async function create() {
        saving = true
        deployment.start = start.toISOString()
        deployment.end = end.toISOString()
        const token = await tokenOrGoto()
        try {
            const result = await request(fetch, '/request/'+deployment.req_id+'/deploy', token, 'POST', { deployment })
            if (result.dep_id) {
                goto(`/dashboard/${deployment.t_id}/${deployment.req_id}/${result.dep_id}`)
                dispatch('create', result.dep_id)
            }
        } catch (e) {
            error=true
        }
    }
    async function save() {
        saving = true
        deployment.start = start.toISOString()
        deployment.end = end.toISOString()
        const token = await tokenOrGoto()
        await request(fetch, '/deployment/'+deployment.dep_id, token, 'POST', { deployment })
    }
    async function del() {
        const token = await tokenOrGoto()
        await request(fetch, '/deployment/'+deployment.dep_id, token, 'DELETE')
        dispatch('delete', deployment.dep_id)
    }
</script>
<Card glow="false">
    {#if deployment.dep_id && !edit }
        <DateRange start={deployment.start} end={deployment.end}/>
        {#if deployment.note}
        <p class="font-medium">{deployment.note}</p>
        {/if}
    {:else}
        <div class="px-2">
            <DateRangeInput bind:start={start} bind:end={end}/>
        </div>
        <TextInput label="Note" bind:value={deployment.note} maxlength={150}/>
    {/if}
    {#if Array.isArray(deployment.items) && deployment.items.length > 0 && !edit}
        <ul class="flex flex-wrap gap-1 mt-2">
            <span class="font-semibold px-1">Items:</span>
            {#each deployment.items as item}
                <li class="px-3 bg-slate-300/50 dark:bg-slate-600/50 rounded-full">
                    {item.count} x <span class="font-medium">{item.item}</span>
                </li>
            {/each}
        </ul>
    {/if}
    {#if Array.isArray(deployment.services) && deployment.services.length > 0 && !edit}
        <ul class="flex flex-wrap gap-1 mt-2">
            <span class="font-semibold px-1">Services:</span>
            {#each deployment.services as service}
                <li class="px-3 bg-slate-300/50 dark:bg-slate-600/50 rounded-full">
                    <span class="font-medium">{service.service}</span> ({service.members.length})
                </li>
            {/each}
        </ul>
    {/if}
    {#if !deployment.dep_id}
        <div class="flex gap-1 mt-2">
            <Button on:click={create}>Create</Button>
            <Button primary=false on:click={()=>dispatch('cancel')}>Cancel</Button>
        </div>
        {#if error}
            <span class="text-red-500">Failed to create deployment</span>
        {/if}
    {:else if edit}
        <div class="flex gap-1 mt-2">
            <Button on:click={save}>Save</Button>
        </div>
    {:else}
        <div class="flex gap-1 mt-2">
            <LinkButton href="/dashboard/{deployment.t_id}/{deployment.req_id}/{deployment.dep_id}">Edit details</LinkButton>
            <div class="grow"/>
            {#if deleting}
                <Button primary=false on:click={()=>deleting=false}>Cancel</Button>
                <Button danger=true on:click={del}>Delete</Button>
            {:else}
                <Button primary={!deployment.approved}>Approve</Button>
                <button class="p-1" on:click={()=>dispatch('copy', deployment.dep_id)}>
                    <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>
                </button>
                <button class="p-1 text-red-500" on:click={()=>deleting=true}>
                    <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                </button>
            {/if}
        </div>
    {/if}
</Card>