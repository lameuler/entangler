<script lang="ts">
    import { fade } from 'svelte/transition';

    let showing = true
</script>

{#if showing}
<div transition:fade class="fixed flex justify-between items-center gap-4 px-4 py-2 rounded-xl font-medium bg-red-400/70 backdrop-blur-sm dark:bg-red-900/70 border-2 border-red-500 m-2">
    <div>
        <p>The entangler backend is no longer being hosted live, so this site will not work as expected.</p>
        <p>You can <a href="https://github.com/lameuler/entangler" class="underline">view this project on GitHub</a> for more details.</p>
    </div>
    <button on:click={ () => showing = false }>
        <svg viewBox="0 0 24 24" class="icon w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
    </button>
</div>
{/if}