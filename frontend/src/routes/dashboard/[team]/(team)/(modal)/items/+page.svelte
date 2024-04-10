<script lang="ts">
    import Spinner from '$lib/Spinner.svelte';
    import ItemEditor from '$lib/dashboard/ItemEditor.svelte';
    import SidebarLayout from '$lib/dashboard/SidebarLayout.svelte';

    import type { PageData } from './$types';

    export let data: PageData
</script>

{#await data.itemsPromise }
    <Spinner/>
{:then items }
    {#if Array.isArray(items)}
    <SidebarLayout {items} add={'Add item'}>
        <svelte:fragment slot="item" let:item>
            <div class="font-semibold">{item.item}</div>
            <span class="text-sm opacity-80">Total count: {item.count}</span>
        </svelte:fragment>
        <ItemEditor slot="content" let:selected item={selected} team={data.t_id}/>
    </SidebarLayout>
    {/if}
{/await}