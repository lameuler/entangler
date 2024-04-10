<script lang="ts">
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

<slot/>

<svelte:head>
    {#await data.requestPromise }
        <title>Entangler</title>
    {:then request }
        {#if request?.name }
            <title>{ request.name } | Entangler</title>
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