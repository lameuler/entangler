<script lang="ts">
    import { afterUpdate, beforeUpdate, onMount } from 'svelte';
    import type { PageData } from './$types';
    import { handleRedirect } from '$lib/auth';
    import PageSpinner from '$lib/PageSpinner.svelte';
    import { goto } from '$app/navigation';
    
    export let data: PageData;
    let handled = false

    afterUpdate(async () => {
        if (!handled) return
        console.log('authorize:update:before')
        const user = await data.user
        console.log('authorize:update', user)
        if (user) {
            if (user.isNew) {
                goto('/dashboard/account?redirect='+data.redirect, { replaceState: true })
            } else {
                goto(data.redirect, { replaceState: true })
            }
        }
    })
    onMount(async () => {
        handled = await handleRedirect()
        console.log('authorize:handled', handled, data.redirect, data.user, window.location.pathname)
        if(!handled) goto('/', { replaceState: true })
    })
</script>

<PageSpinner/>

<svelte:head>
    <title>Entangler</title>
</svelte:head>