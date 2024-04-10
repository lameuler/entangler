<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import Footer from '$lib/Footer.svelte';
    import NavBar from '$lib/NavBar.svelte';
    import '../app.css'
    import { listener } from '$lib/appearance';
    import { onMount } from 'svelte';
    import PageSpinner from '$lib/PageSpinner.svelte';
    import { account } from '$lib/auth';
    import type { LayoutData } from './$types';
    import { page } from '$app/stores';

    export let data: LayoutData

    onMount(listener)

    let invalidating = false

    onMount(() => {
        const unsubscribe = account.subscribe(async account => {
            const user = await data.user
            if (user?.u_id != account?.localAccountId && !invalidating) {
                invalidating = true
                await invalidateAll()
                invalidating = false
            }
        })

        data.user.catch(err => {
            if (((err as Error).cause as { status: number })?.status === 401) {
                goto('/logout?redirect=/login', { replaceState: true })
            }
        })

        return unsubscribe
    })
    
</script>

<div class="grid grid-rows-[1fr_auto] h-full w-full">
    <header class="fixed w-full flex justify-center top-0 z-40">
        <NavBar user={data.user}/>
    </header>
    <div class="max-w-6xl justify-self-center w-full relative"><slot>
        <PageSpinner/>
    </slot></div>
    <footer class="w-full flex justify-center"><Footer/></footer>
</div>