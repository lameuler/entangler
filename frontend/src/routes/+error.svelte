<script lang="ts">
    import { page } from '$app/stores';
    import PageError from '$lib/display/PageError.svelte';
</script>

<PageError status={$page.status} message={$page.error?.message}/>