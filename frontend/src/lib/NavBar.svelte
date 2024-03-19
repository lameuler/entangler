<script lang="ts">
    import { onMount } from 'svelte';
    import Appearance from './Appearance.svelte';
    import { fly } from 'svelte/transition';
    import { login, account, logout } from './auth';

    // let app: PublicClientApplication | undefined = undefined;
    import { page } from '$app/stores';
    import type { User } from './api';
    import UserInfo from './UserInfo.svelte';
    import { onNavigate } from '$app/navigation';
    import { redirect } from '@sveltejs/kit';
    import LinkButton from './input/LinkButton.svelte';

    export let user: Promise<User | null>

    onMount(() => {
        // console.log(accounts())
    })

    onNavigate(() => { showAccMenu = false })

    let showAccMenu = false
    let accMenu: HTMLDivElement
    const handleClick = (event: MouseEvent) => {
        if (!accMenu?.contains(event.target as Node)) showAccMenu = false
    }

</script>
<nav class="flex relative justify-between items-center px-4 h-16 w-full max-w-6xl bg-gradient-to-b from-slate-50 dark:from-slate-950 via-slate-50/85 dark:via-slate-950/75 to-transparent">
    <a href="/" class="text-lg font-semibold flex items-center gap-1">
        <svg class="icon h-6 w-6" viewBox="0 0 24 24" stroke-width="2.5">
            <path d="M6 17.6l-2 -1.1v-2.5" /><path d="M4 10v-2.5l2 -1.1" /><path d="M10 4.1l2 -1.1l2 1.1" /><path d="M18 6.4l2 1.1v2.5" /><path d="M20 14v2.5l-2 1.12" /><path d="M14 19.9l-2 1.1l-2 -1.1" /><path d="M12 12l2 -1.1" /><path d="M18 8.6l2 -1.1" /><path d="M12 12l0 2.5" /><path d="M12 18.5l0 2.5" /><path d="M12 12l-2 -1.12" /><path d="M6 8.6l-2 -1.1" />
        </svg>
        <span class="hidden sm:inline">Entangler</span>
    </a>
    <div class="flex items-center gap-2">
        <a href="/search" class="px-2 py-1 hover:underline">Search</a>
        {#if $account}
            <LinkButton href="/dashboard">Dashboard</LinkButton>
            <div class="flex" bind:this={accMenu}>
                <button on:click={ ()=>showAccMenu = !showAccMenu }>
                    <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></svg>
                </button>
                {#if showAccMenu}
                <div transition:fly={{ x:0, y:-10, duration: 250 }}
                class="absolute bg-slate-100/60 dark:bg-slate-700/60 border border-slate-400 dark:border-slate-600 backdrop-blur-md z-20 top-12 right-4 m-0.5 w-60 p-1 rounded-xl shadow-lg">
                    <div class="px-3 py-2">
                        <UserInfo {user}/>
                    </div>
                    <div class="flex">
                        <a href="/dashboard/account" class="px-3 py-1 text-violet-600 dark:text-violet-400 hover:underline rounded-lg grow">
                            View Account
                        </a>
                        <LinkButton href="/logout?redirect={$page.url.pathname}">
                            Log out
                        </LinkButton>
                    </div>
                </div>
                {/if}
            </div>
        {:else}
            <a href="/login?redirect={$page.url.pathname === '/login' ? $page.data.redirect : $page.url.pathname}" class="bg-violet-600 text-white px-3 py-1 rounded-md font-medium">Login</a>
        {/if}
        <Appearance/>
    </div>
</nav>

<svelte:body on:click={ handleClick }/>