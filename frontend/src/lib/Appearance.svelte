<script lang="ts">
    import { appearance } from './appearance';
</script>

{#if $appearance?.theme === 'dark'}
    <button on:click={() => appearance.set('light')} class="p-1">
        <svg class="icon" viewBox="0 0 24 24">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
            <path d="M19 11h2m-1 -1v2" />
        </svg>
    </button>
{:else if $appearance?.theme === 'light'}
    <button on:click={() => appearance.set('dark')} class="p-1">
        <svg class="icon" viewBox="0 0 24 24">
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
        </svg>
    </button>
{/if}

<style lang="postcss">
    button {
        @apply block rounded-full opacity-60 enabled:hover:opacity-80
    }
    svg.icon {
        @apply w-6 h-6
    }
</style>