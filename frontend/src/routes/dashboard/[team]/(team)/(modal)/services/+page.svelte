<script lang="ts">
    import SidebarLayout from '$lib/dashboard/SidebarLayout.svelte';
    import Spinner from '$lib/Spinner.svelte';
    
    import type { PageData } from './$types';
    import ServiceEditor from '$lib/dashboard/ServiceEditor.svelte';

    export let data: PageData
</script>

{#await data.servicesPromise }
    <Spinner/>
{:then services }
    {#if Array.isArray(services)}
    <SidebarLayout items={services} add={'Add service'}>
        <svelte:fragment slot="item" let:item>
            <div class="font-semibold">{item.service}</div>
        </svelte:fragment>
        <ServiceEditor slot="content" let:selected service={selected} team={data.t_id}/>
    </SidebarLayout>
    {/if}
{/await}