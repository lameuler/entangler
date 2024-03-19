<script lang="ts">
    import type { Booleanish } from 'svelte/elements';
    import Glow from './Glow.svelte';

    export let glow: Booleanish | 'lg' | 'xl' | '2xl' |'3xl' = true

</script>

<div class="bg-gray-50/80 dark:bg-slate-900/90 relative border border-gray-300 dark:border-gray-800 p-4 rounded-2xl shadow-md">
    <slot/>
    {#if glow && glow !== 'false' }
        <Glow size={ glow === true || glow === 'true' ? undefined: glow }/>
    {/if}
</div>