<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Booleanish, MouseEventHandler } from 'svelte/elements';

    export let primary: Booleanish | null | undefined = true
    export let full: Booleanish | null | undefined = false
    export let disabled: boolean | null | undefined = undefined
    export let type: "button" | "submit" | "reset" | null | undefined = undefined
    export let fit: boolean | null | undefined = false

    const dispatch = createEventDispatcher<{ click: undefined }>()
</script>

<button on:click={ () => dispatch('click') }
class="flex justify-center items-center gap-1 px-3 h-8 rounded-lg disabled:opacity-60
{ primary===true || primary==='true' ? 'bg-violet-600 text-white' : 'bg-slate-300 dark:bg-slate-700'}
{ full===true || full==='true' ? 'w-full' : ''}
{ fit ? 'w-fit' : ''}"
{disabled} {type}>
    <slot/>
</button>