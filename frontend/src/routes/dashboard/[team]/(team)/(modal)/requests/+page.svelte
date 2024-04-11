<script lang="ts">
    import Spinner from '$lib/Spinner.svelte';
    import { search } from '$lib/api';
    import RequestCard from '$lib/dashboard/RequestCard.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import FiltersConfig from '$lib/input/FiltersConfig.svelte';
    import Search from '$lib/input/Search.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    let error = ''
    let filter = ''
    const options = [['Pending', 'Approved', 'Rejected']]

    function onUpdate(f: any) {
        filter = data.filter ?? ''
    }
    $: onUpdate(data.filter)

</script>

{#await data.requestsPromise}
    <Spinner/>
{:then result}
    <ErrorAlert bind:error/>
    <div class="absolute flex flex-col h-full w-full">
        <div class="px-2 pt-2"><Search value={ data.q ?? undefined }
            on:search={({detail}) => search('/dashboard/'+data.t_id+'/requests', detail, filter)}>
            <FiltersConfig bind:filter {options}/>
        </Search>
        </div>
        <div class="px-2 pb-24 overflow-y-scroll">
        {#if Array.isArray(result.requests)}
            {#each result.requests as request}
                <RequestCard {request} editing manager/>
            {/each}
        {:else}
            <ErrorAlert/>
        {/if}
        </div>
    </div>
{:catch}
    <ErrorAlert/>
{/await}