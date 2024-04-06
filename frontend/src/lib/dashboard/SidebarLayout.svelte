<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let showContent = true
    const dispatch = createEventDispatcher<{back: undefined}>()
</script>

<div class="h-full w-full absolute flex bg-inherit">
    <div class="flex flex-col w-full h-full sm:w-56 sm:border-e p-1 border-slate-400 dark:border-slate-600 absolute sm:static">
        {#if $$slots.top}
        <div class="shrink-0 p-1">
            <slot name="top"/>
        </div>
        {/if}
        <div class="flex flex-col p-1 grow shrink overflow-auto">
            <slot name="items"/>
        </div>
        {#if $$slots.bottom}
        <div class="shrink-0 p-1 mb-2">
            <slot name="bottom"/>
        </div>
        {/if}
    </div>
    {#if showContent }
    <div class="p-4 flex flex-col grow w-full h-full sm:w-auto bg-inherit absolute sm:static overflow-y-auto">
        <button on:click={ ()=>dispatch('back', undefined, undefined) } class="text-violet-600 dark:text-violet-400 flex items-center -mx-2 -mt-1 p-1 sm:hidden">
            <svg viewBox="0 0 24 24" class="icon h-5 w-5">
                <path d="M15 6l-6 6l6 6" />
            </svg>
            Back
        </button>
        <slot/>
    </div>
    {/if}
</div>