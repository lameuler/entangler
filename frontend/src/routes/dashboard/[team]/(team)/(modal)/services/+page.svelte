<script lang="ts">
    import SidebarLayout from '$lib/dashboard/SidebarLayout.svelte';
    import Search from '$lib/input/Search.svelte';
    import Button from '$lib/input/Button.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import { media } from '$lib/utils';
    import Fuse from 'fuse.js'
    
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { pushState } from '$app/navigation';
    import { onMount } from 'svelte';
    import TextInput from '$lib/input/TextInput.svelte';

    export let data: PageData
</script>

{#await data.servicesPromise }
    <Spinner/>
{:then items }
    <SidebarLayout {items} add={'Add service'}>
        <svelte:fragment slot="item" let:item>
            <div class="font-semibold">{item.service}</div>
        </svelte:fragment>
        <!-- <ServiceEditor slot="content" let:selected item={selected} team={data.t_id}/> -->
    </SidebarLayout>
{/await}