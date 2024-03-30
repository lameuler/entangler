<script lang="ts">
    import DeploymentItems from '$lib/dashboard/DeploymentItems.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    let editingItems = true
</script>

<main class="flex flex-col gap-6 h-full">
    <div class="flex flex-col lg:flex-row justify-between pt-4 gap-2 w-full">
        <div>
            <h1 class="text-2xl font-medium mt-1">
                {#if data.deployment === 'deploy'} Create {:else} Edit {/if}
                Deployment
            </h1>
        </div>
        <div class="flex flex-row flex-wrap lg:flex-col lg:items-end gap-1 text-slate-700/80 dark:text-slate-300/80">
            <span>Created by <b>Lam Eu Ler</b></span>
            <span>15 December 2023 01:02:03 AM</span>
        </div>
    </div>
    <div class="p-4 sm:p-10">
        <h2 class="text-xl font-semibold">Details</h2>
        <div>
            <h2 class="text-xl font-semibold">Items</h2>
            <button on:click={ () => editingItems = true}>Edit</button>
        </div>
        <div>
        </div>
        <h2 class="text-xl font-semibold">Services</h2>
    </div>
</main>

<DeploymentItems bind:open={editingItems}/>