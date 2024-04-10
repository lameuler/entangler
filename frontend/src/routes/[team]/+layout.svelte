<script lang="ts">
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

<slot/>

<svelte:head>
    {#await data.teamPromise }
        <title>Entangler</title>
    {:then team }
        {#if team?.name }
            <title>{ team.name } | Entangler</title>
        {:else}
            <title>Entangler</title>
        {/if}
    {:catch err}
        {#if err?.cause?.status === 404 }
            <title>Not found | Entangler</title>
        {:else}
            <title>Entangler</title>
        {/if}
    {/await}
</svelte:head>