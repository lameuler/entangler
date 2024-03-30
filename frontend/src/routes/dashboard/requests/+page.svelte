<script lang="ts">
    import type { PageData } from './$types';
    import RequestCard from '$lib/dashboard/RequestCard.svelte';
    import { crumbs } from '../crumb';
    import SearchLayout from '$lib/dashboard/SearchLayout.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import ActionLink from '$lib/ActionLink.svelte';
    import { search } from '$lib/api';

    export let data: PageData

    const options = [['Pending', 'Approved', 'Rejected']]

    $crumbs = [{ name: 'Requests', path: '/dashboard/requests' }]
</script>

<SearchLayout q={data.q ?? ''} search={(q, filter) => search('/dashboard/requests', q, filter)} {options} filter={data.filter ?? ''}>
    {#await data.requestsPromise }
        <Spinner/>
    {:then result }
        {#if result.requests }
            <div class="text-sm px-4 text-slate-500">
                View the requests you submtited to teams.
            </div>
            <div class="flex flex-col gap-2">
                {#each result.requests as request }
                    <RequestCard {request}/>
                    {:else}
                    <div class="col-span-full text-center p-8 text-slate-700 dark:text-slate-300">
                        No requests found.<br/>
                        <ActionLink href="/search">
                            Find teams to make a request
                        </ActionLink>
                    </div>
                {/each}
            </div>
        {:else}
            <ErrorAlert/>
        {/if}
    {:catch}
        <ErrorAlert/>
    {/await}
</SearchLayout>