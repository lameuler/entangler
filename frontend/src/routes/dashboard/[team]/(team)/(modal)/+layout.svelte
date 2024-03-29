<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import PopUpShelf from '$lib/PopUpShelf.svelte';
    import { join, title } from '$lib/utils';
    const pathname = $page.url.pathname
</script>

<PopUpShelf title={title(pathname)} close='none' on:close={ () => goto(join(pathname, '', 1)) }>
    <slot/>
</PopUpShelf>