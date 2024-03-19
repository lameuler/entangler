<script lang="ts">
    import { page } from '$app/stores';

    export let href: string|null|undefined = undefined
</script>

{#if href && new URL(href, window.location.origin).pathname !== $page.url.pathname}
    <a {href} class="hover:underline">
        <slot/>
    </a>
{:else}
    <span class="font-semibold">
        <slot/>
    </span>
{/if}