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

    const [sm, mount] = media('(min-width: 640px)')

    onMount(mount)

    let fuse: Fuse<any> | undefined = undefined

    $: data.itemsPromise.then(items => fuse = new Fuse(items, { keys: ['service', { name: 'description', weight: 0.4 }] }))

    $: selected = $page.state.selected ?? ($sm ? 0 : -1)

    let search = ''
    $: view = search ? fuse?.search(search).map(res => res.item) : undefined

    function open(i: number) {
        if (!$sm) pushState('', { selected: i })
        else selected = i
    }
    function close() {
        history.back()
    }
</script>

{#await data.servicesPromise }
    <Spinner/>
{:then services }
    <SidebarLayout showContent={ selected >= 0 } on:back={close}>
        <Search slot="top" bind:value={search}/>
        <svelte:fragment slot="items">
        {#each view ?? services as service, i }
            <button class="flex text-start items-center justify-between rounded-lg" class:bg-violet-600={ selected===i } class:text-white={ selected===i }
                on:click={ () => open(i) }>
                <div class="px-3 py-2">
                    <div class="font-semibold">{service.service}</div>
                </div>
                <svg class="icon w-6 h-6 text-slate-500 shrink-0" class:invisible={ selected===i } viewBox="0 0 24 24"><path d="M9 6l6 6l-6 6"/></svg>
            </button>
        {/each}
        </svelte:fragment>
        <Button slot="bottom" full>
            <svg viewBox="0 0 24 24" class="icon w-5 h-5">
                <path d="M12 5l0 14" /><path d="M5 12l14 0" />
            </svg>
            Add Service
        </Button>
        
        <svelte:fragment>
            {#if services[selected]}
            <h2 class="text-xl font-semibold">{ services[selected].service }</h2>
            <TextInput label="Description" value={ services[selected].description }/>
            <h3 class="text-lg font-semibold mt-4">Deployments</h3>
            hi
            {/if}
        </svelte:fragment>
    </SidebarLayout>
{/await}