<script lang="ts">
    import { goto } from '$app/navigation';
    import PageSpinner from '$lib/PageSpinner.svelte';
    import { logout } from '$lib/auth';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    $: {
        console.log('help')
        logout()
        goto(data.redirect, { replaceState: true })
    }
    
    // onMount
</script>

<PageSpinner/>

<svelte:head>
    <title>Logging out | Entangler</title>
</svelte:head>