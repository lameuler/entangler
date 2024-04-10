<script lang="ts">
    import { goto } from '$app/navigation';
    import PopUpShelf from '$lib/PopUpShelf.svelte';
    import SidebarLayout from '$lib/dashboard/SidebarLayout.svelte';
    import { s } from '$lib/utils';
    import type { PageData } from './$types';
    import Spinner from '$lib/Spinner.svelte';
    import ServiceDeploy from '$lib/dashboard/ServiceDeploy.svelte';
    
    export let data: PageData;

    function transform(services: any[], service_reqs: any[], service_deps: any[]) {
        return services.map(service => {
            return {
                ...service,
                requested: service_reqs.some(s => s.service===service.service),
                deployed: service_deps.find(s => s.service===service.service)?.members ?? []
            }
        }).toSorted((a,b) => (a.deployed.length || b.deployed.length) ? b.deployed.length-a.deployed.length : b.requested-a.requested)
    }
</script>

<PopUpShelf title="Services" close='none' on:close={ () => goto('/dashboard/'+data.t_id+'/'+data.req_id+'/'+data.dep_id) }>
    {#await Promise.all([data.deploymentPromise, data.requestPromise, data.servicesPromise])}
    <Spinner/>
    {:then [deployment, request, services]}
    <SidebarLayout items={transform(services, request.services, deployment.services)}>
        <svelte:fragment slot="item" let:item>
            <div class="font-semibold">{item.service}</div>
            
            {#if item.deployed?.length}
                <span class="text-sm">{item.deployed.length} member{s(item.deployed.length)} deployed</span>
            {:else if item.requested}
                <span class="text-sm opacity-80">Requested</span>
            {/if}
        </svelte:fragment>
        <ServiceDeploy slot="content" let:selected service={selected} dep_id={deployment.dep_id} t_id={data.t_id}/>
    </SidebarLayout>
    {/await}
</PopUpShelf>