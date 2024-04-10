<script lang="ts">
    import { goto } from '$app/navigation';
    import PopUpShelf from '$lib/PopUpShelf.svelte';
    import SidebarLayout from '$lib/dashboard/SidebarLayout.svelte';
    import type { PageData } from './$types';
    import Spinner from '$lib/Spinner.svelte';
    import ItemDeploy from '$lib/dashboard/ItemDeploy.svelte';
    
    export let data: PageData;

    function transform(items: any[], item_reqs: any[], item_deps: any[]) {
        return items.map(item => {
            return {
                ...item,
                requested: item_reqs.find(i => i.item===item.item)?.count ?? 0,
                deployed: item_deps.find(i => i.item===item.item)?.count ?? 0
            }
        }).toSorted((a,b) =>  (a.deployed || b.deployed) ? b.deployed-a.deployed : b.requested-a.requested)
    }
</script>

<PopUpShelf title="Items" close='none' on:close={ () => goto('/dashboard/'+data.t_id+'/'+data.req_id+'/'+data.dep_id) }>
    {#await Promise.all([data.deploymentPromise, data.requestPromise, data.itemsPromise])}
    <Spinner/>
    {:then [deployment, request, items]}
    <SidebarLayout items={ transform(items, request.items ?? [], deployment.items ?? []) }>
        <svelte:fragment slot="item" let:item>
            <div class="font-semibold">{item.item}</div>
            {#if item.deployed}
                <span class="text-sm">{item.deployed} deployed</span>
            {:else if item.requested}
                <span class="text-sm opacity-80">{item.requested} requested</span>
            {/if}
        </svelte:fragment>
        <ItemDeploy slot="content" let:selected item={selected} dep_id={deployment.dep_id}/>
    </SidebarLayout>
    {/await}
</PopUpShelf>