<script lang="ts">
    export let close: (() => any) | null | undefined = undefined 
</script>

<div class="w-full flex items-center gap-2 px-2 py-1 font-medium rounded-lg bg-red-400/30 dark:bg-red-700/30 border-2 border-red-400 dark:border-red-700">
    <div class="flex items-center gap-2 px-2 py-1 grow">
        <svg viewBox="0 0 24 24" class="icon h-6 w-6 text-red-500 dark:text-red-600">
            <path fill="currentColor" stroke="none" d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
        </svg>
        <slot/>
    </div>
    {#if close}
    <button class="justify-self-end p-1 shrink-0" on:click={close}>
        <svg viewBox="0 0 24 24" class="icon h-6 w-6 text-gray-600 dark:text-gray-400">
            <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
        </svg>
    </button>
    {/if}
</div>