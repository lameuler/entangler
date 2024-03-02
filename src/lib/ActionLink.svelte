<script lang="ts">
    export let href: string | null | undefined
</script>

<a {href} class="inline-flex w-fit items-center font-medium px-1.5 py-0.5 -mx-1.5 -my-0.5 rounded-md underline text-violet-600 dark:text-violet-400 hover:bg-slate-400/30 dark:hover:bg-slate-600/40">
    <slot/>
    <svg class="icon h-6 w-6 -me-0.5 shrink-0" viewBox="0 0 24 24">
        <path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" />
    </svg>
</a>