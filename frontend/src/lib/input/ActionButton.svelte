<script lang="ts">
    import type { Booleanish, MouseEventHandler } from 'svelte/elements';

    export let onClick: MouseEventHandler<HTMLButtonElement>
    export let primary: Booleanish | null | undefined = true
    export let disabled: boolean | null | undefined = undefined
</script>

<button on:click={ onClick }
class="flex justify-center items-center gap-3 px-3 h-8 rounded-lg disabled:opacity-60 { primary===true || primary==='true' ? 'bg-violet-600 text-white' : 'bg-slate-300 dark:bg-slate-700'}"
{disabled}>
    <slot/>
</button>