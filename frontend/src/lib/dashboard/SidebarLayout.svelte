<script lang="ts">
    import { pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import Button from '$lib/input/Button.svelte';
    import Search from '$lib/input/Search.svelte';
    import { media } from '$lib/utils';
    import Fuse from 'fuse.js';
    import { createEventDispatcher, onMount } from 'svelte';

    export let add: string | null | undefined = undefined
    export let items: any[] = []
    export let selected: any = undefined

    // const dispatch = createEventDispatcher<{back: undefined, add:undefined}>()

    const [sm, mount] = media('(min-width: 640px)')

    onMount(mount)

    $: fuse = new Fuse(items, { keys: ['item', { name: 'description', weight: 0.4 }] })

    $: selected = $sm ? (selected!==undefined ? selected : items[0]) : items[$page.state.selected ?? -1]

    $: console.log('selected' in $page.state, $page.state)

    let search = ''
    $: view = search ? fuse?.search(search).map(res => res.item) : undefined

    function open(i: any) {
        if (!$sm) pushState('', { selected: items.indexOf(i) })
        else selected = i
    }
    function close() {
        history.back()
    }
</script>

<div class="h-full w-full absolute flex bg-inherit">
    <div class="flex flex-col w-full h-full sm:w-56 sm:border-e p-1 border-slate-400 dark:border-slate-600 absolute sm:static">
        <div class="shrink-0 p-1">
            <Search bind:value={search}/>
        </div>
        <div class="flex flex-col p-1 grow shrink overflow-auto">
            {#each view ?? items as i }
                <button class="flex text-start items-center justify-between rounded-lg" class:bg-violet-600={ selected===i } class:text-white={ selected===i }
                    on:click={ () => open(i) }>
                    <div class="px-3 py-2">
                        <slot name="item" item={i}/>
                    </div>
                    <svg class="icon w-6 h-6 text-slate-500 shrink-0" class:invisible={ selected===i } viewBox="0 0 24 24"><path d="M9 6l6 6l-6 6"/></svg>
                </button>
            {/each}
        </div>
        {#if $$slots.bottom}
        <div class="shrink-0 p-1 mb-2">
            <slot name="bottom"/>
        </div>
        {:else if add}
        <div class="shrink-0 p-1 mb-2">
            <Button full on:click={() => selected=null}>
                <svg viewBox="0 0 24 24" class="icon w-5 h-5">
                    <path d="M12 5l0 14" /><path d="M5 12l14 0" />
                </svg>
                {add}
            </Button>
        </div>
        {/if}
    </div>
    {#if selected !== undefined }
    <div class="p-4 flex flex-col grow w-full h-full sm:w-auto bg-inherit absolute sm:static overflow-y-auto">
        <button on:click={ ()=>close() } class="text-violet-600 dark:text-violet-400 flex items-center -mx-2 -mt-1 p-1 sm:hidden">
            <svg viewBox="0 0 24 24" class="icon h-5 w-5">
                <path d="M15 6l-6 6l6 6" />
            </svg>
            Back
        </button>
        <slot name="content" {selected}/>
    </div>
    {/if}
</div>