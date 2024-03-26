<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Input from './TextInput.svelte';
    import { fly } from 'svelte/transition';
    
    export let value = ''
    export let configOpen = false
    export let configNotifs = 0
    let configDiv: HTMLDivElement

    const dispatch = createEventDispatcher<{ search: string, reset: undefined }>()

    const handleClick = (event: MouseEvent) => {
        if (!configDiv?.contains(event.target as Node)) configOpen = false
    }
</script>
<Input placeholder="Search" bind:value on:submit={ event => { configOpen = false; dispatch('search', event.detail) } }>
    <button slot="left" type="submit" class="p-2 -mr-2 opacity-50 hover:opacity-80">
        <svg class="h-6 w-6 icon" viewBox="0 0 24 24">
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
        </svg>
    </button>
    <svelte:fragment slot="right">
        {#if value.length > 0}
            <button type="reset" class="p-2 opacity-50 hover:opacity-80" on:click={ () => { value=''; dispatch('reset')} }>
                <svg class="icon h-6 w-6" viewBox="0 0 24 24">
                    <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                </svg>
            </button>
        {/if}
        {#if $$slots.config}
            <button type="button" class="p-2 group relative" on:click|stopPropagation={ () => configOpen = !configOpen}>
                <svg class="icon h-6 w-6 opacity-50 group-hover:opacity-80" viewBox="0 0 24 24">
                    <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" />
                </svg>
                {#if configNotifs}
                <span class="absolute top-1 right-1 rounded-full px-1 bg-violet-600 text-white text-xs h-4 min-w-4 text-center content-center">
                    { configNotifs }
                </span>
                {/if}
            </button>
            {#if configOpen}
                <div transition:fly={{ x:0, y:-10, duration: 250 }} bind:this={configDiv}
                class="absolute right-0 top-full -mt-1 -mr-1 p-2 rounded-xl bg-slate-100/50 dark:bg-slate-700/50 border border-gray-300 dark:border-gray-700 backdrop-blur-xl shadow-lg">
                    <slot name="config"/>
                </div>
            {/if}
        {/if}
    </svelte:fragment>
</Input>

<svelte:body on:click={handleClick}/>