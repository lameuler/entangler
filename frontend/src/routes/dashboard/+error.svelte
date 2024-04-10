<script lang="ts">
    import { page } from '$app/stores';
    import PageError from '$lib/display/PageError.svelte';
</script>

<PageError status={$page.status} message={$page.error?.message}/>

<svelte:head>
    <title>{ $page.status === 404 ? 'Not found' : 'Error'} | Entangler</title>
</svelte:head>