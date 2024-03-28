<script lang="ts">
    import type { Booleanish } from 'svelte/elements';

    export let href: string
    export let primary: Booleanish = true
</script>

<a {href} class="px-3 py-1 h-8 flex items-center justify-center gap-1 rounded-md font-medium { primary===true || primary==='true' ? 'bg-violet-600 text-white' : 'bg-slate-300/80 dark:bg-slate-700/80'}">
    <slot/>
</a>