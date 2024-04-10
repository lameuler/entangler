<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { invalidator, request } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Button from '$lib/input/Button.svelte';
    import IncrementInput from '$lib/input/IncrementInput.svelte';

    export let dep_id: string
    export let item: any
    let error = ''

    async function save() {
        const token = await tokenOrGoto()
        const i = { item: item.item, t_id: item.t_id, count: item.deployed }
        const path = '/deployment/'+dep_id
        try {
            await request(fetch, path, token, 'POST', { deployment: { items: [i] }})
        } catch (e) {
            error = (e as Error).message
        }
    }
</script>

{#if error}
<ErrorAlert bind:error/>
{/if}

<div class="flex justify-between">
    <div>
        <h2 class="text-xl font-semibold">{ item.item }</h2>
        {#if item.description}
            <p class="text-slate-700 dark:text-slate-300">{ item.description }</p>
        {/if}
    </div>
    <Button on:click={save}>Save</Button>
</div>

<p class="mb-4"><span class="font-semibold">{item.requested}</span> requested</p>

<IncrementInput label="Deploying:" labelposition="side" bind:value={ item.deployed }/>