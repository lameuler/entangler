<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let error: boolean | string | undefined = true
    export let type: 'error' | 'warning' = 'error'
    export let action: (() => any) | undefined = () => {
        if (type === 'warning') {
            error = false
        } else {
            window.location.reload()
        }
    } 
</script>

{#if error}
<div class="w-full flex items-center gap-2 px-2 py-1 font-medium rounded-lg border-2 { type === 'warning' ? 'bg-yellow-400/30 dark:bg-yellow-700/30 border-yellow-300 dark:border-yellow-700' : 'bg-red-400/30 dark:bg-red-700/30 border-red-400 dark:border-red-700'}">
    <div class="flex items-center gap-2 px-2 py-1 grow">
        <svg viewBox="0 0 24 24" class="icon h-6 w-6 shrink-0 { type === 'warning' ? 'text-amber-500' : 'text-red-500 dark:text-red-600'}">
            <path fill="currentColor" stroke="none" d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
        </svg>
        <slot>
            { typeof error === 'string' && error ? error : 'Something went wrong!' }
        </slot>
    </div>
    <button class="justify-self-end p-1 shrink-0 font-normal text-gray-600 dark:text-gray-400" on:click={ action }>
        <slot name="button">
            {#if type === 'warning' }
                <svg viewBox="0 0 24 24" class="icon h-6 w-6">
                    <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                </svg>
            {:else}
                Reload
            {/if}
        </slot>
    </button>
</div>
{/if}