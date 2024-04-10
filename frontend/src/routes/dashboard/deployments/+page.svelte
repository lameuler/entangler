<script lang="ts">
    import type { PageData } from './$types';
    import { crumbs } from '../crumb';
    import SearchLayout from '$lib/dashboard/SearchLayout.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import { search } from '$lib/api';
    import UserDeploymentCard from '$lib/dashboard/UserDeploymentCard.svelte';

    export let data: PageData

    const options = [['Pending', 'Approved']]

    $crumbs = [{ name: 'Deployments', path: '/dashboard/deployments' }]
</script>

<SearchLayout q={data.q ?? ''} search={(q, filter) => search('/dashboard/deployments', q, filter)} {options} filter={data.filter ?? ''}>
    {#await data.deploymentsPromise }
        <Spinner/>
    {:then result }
        {#if result.deployments }
            <div class="text-sm px-4 text-slate-500">
                View your deployments.
            </div>
            <div class="flex flex-col gap-2">
                {#each result.deployments as deployment }
                    <UserDeploymentCard {deployment}/>
                    {:else}
                    <div class="col-span-full text-center p-8 text-slate-700 dark:text-slate-300">
                        No deployments found.
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

<svelte:head>
    <title>Deployments | Entangler</title>
</svelte:head>