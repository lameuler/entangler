<script lang="ts">
    import { page } from '$app/stores';

    export let href: string

    $: selected = href === $page.url.pathname
</script>

<div class="flex grow items-center gap-1 relative">
    <div class="h-6 shrink-0 w-1 rounded-r-md" class:bg-violet-600={ selected }></div>
    <a {href} class="flex items-center gap-1.5 px-2 py-1 w-full rounded-md hover:bg-slate-400/30 dark:hover:bg-slate-600/40" class:font-semibold={ selected }>
        <slot/>
    </a>
</div>