<script lang="ts">
    import ActionLink from '$lib/ActionLink.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import RequestCard from '$lib/dashboard/RequestCard.svelte';
    import RequestDeployment from '$lib/dashboard/RequestDeployment.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import PageError from '$lib/display/PageError.svelte';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
</script>

{#await Promise.all([data.requestPromise, data.deploymentPromise])}
    <Spinner/>
{:then [request, deployment]}
{#if request && deployment}
<main class="flex flex-col gap-6 h-full pt-4">
    <RequestCard {request} manager/>
    <h2 class="text-xl font-semibold">Deployment</h2>
    <RequestDeployment {deployment} edit/>
    <section id="items">
        <div class="flex justify-between gap-2">
            <h2 class="text-xl font-semibold">Items</h2>
            <ActionLink href="/dashboard/{data.t_id}/{data.req_id}/{data.dep_id}/items">Edit deployment</ActionLink>
        </div>
        <table class="border-spacing-2 border-separate">
            {#each Array.isArray(deployment.items) ? deployment.items : [] as item}
                <tr class="p-2">
                    <td class="font-semibold text-lg">{ item.item }</td>
                    <td>
                        <span class="px-3 py-1 bg-slate-300/50 dark:bg-slate-600/50 rounded-full content-center">
                            <span class="font-medium">{item.count}</span> deployed
                        </span>
                    </td>
                </tr>
            {:else}
                <td class="opacity-60">No items deployed</td>
            {/each}
        </table>
    </section>

    <section id="services">
        <div class="flex justify-between gap-2">
            <h2 class="text-xl font-semibold">Services</h2>
            <ActionLink href="/dashboard/{data.t_id}/{data.req_id}/{data.dep_id}/services">Edit deployment</ActionLink>
        </div>
        <table class="border-spacing-2 border-separate">
            {#each Array.isArray(deployment.services) ? deployment.services : [] as service}
                <tr class="p-2">
                    <td class="font-semibold text-lg">{ service.service }</td>
                    <td class="flex flex-wrap gap-x-2 gap-y-1">
                        {#each service.members as member}
                            <span class="px-3 py-1 bg-slate-300/50 dark:bg-slate-600/50 rounded-full content-center">
                                <span class="font-medium">{member.name}</span>
                                {#if member.role}
                                    <span class="opacity-80">({member.role})</span>
                                {/if}
                            </span>
                        {/each}
                    </td>
                </tr>
            {:else}
                <td class="opacity-60">No services deployed</td>
            {/each}
        </table>
    </section>
</main>

<slot/>
{:else}
    <PageError message="Deployment not found"/>
{/if}
{:catch err}
    <PageError status={err?.cause?.status} message={err?.message}/>
{/await}