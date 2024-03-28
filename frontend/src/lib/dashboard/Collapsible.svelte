<script lang="ts">
    import { slide } from 'svelte/transition';

    export let open: boolean = false
    export let title: string
    export let length: number|null|undefined
</script>

<button class="flex items-center mt-2 -ms-2 group" on:click={ ()=>open=!open}>
    <svg viewBox="0 0 24 24" class="icon h-6 w-6 opacity-50 group-hover:opacity-80 transition-transform" class:rotate-90={open}>
        <path d="M9 6l6 6l-6 6" />
    </svg>
    <span class="font-semibold text-lg me-1 opacity-80 hover:opacity-100" class:opacity-100={open}>
        { title }
    </span>
    {#if length}
    <span class="text-sm content-center rounded-full px-1 h-5 min-w-5 opacity-80 bg-slate-500/40">
        { length }
    </span>
    {/if}
</button>
{#if open}
<div transition:slide>
    <slot/>
</div>
{/if}