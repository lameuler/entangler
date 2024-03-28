<script lang="ts">
    import NavLink from '$lib/dashboard/NavLink.svelte';
    import { onMount } from 'svelte';
    import type { LayoutData } from './$types';
    import { crumbs } from './crumb';
    import PageLink from '$lib/PageLink.svelte';
    import { beforeNavigate } from '$app/navigation';
    
    // export let data: LayoutData;

    let showing = false
    let menu: HTMLElement

    onMount(() => {
        matchMedia('(min-width: 768px)').addEventListener('change', event => {
            event.matches
            showing = false
        })
    })

    beforeNavigate(() => {
        showing = false
    })

    const handleClick = (event: MouseEvent) => {
        if (!menu?.contains(event.target as Node)) showing = false
    }
</script>

<div class="">
    <nav bind:this={menu} class="fixed pt-12 top-0 bottom-0 md:bottom-12 w-64 z-20 border-r md:border-none border-slate-300 dark:border-slate-700 -translate-x-full md:translate-x-0 transition-transform bg-slate-50 dark:bg-slate-950" class:translate-x-0={showing}>
        <div class="h-full pe-2 overflow-auto">
            <div class="sticky h-8 top-0 -me-2 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-10"/>
            <div class="flex items-center">
                <NavLink href="/dashboard">
                    <span class="text-lg font-medium px-1">Dashboard</span>
                </NavLink>
                <button on:click={ () => showing = false } class="p-1 md:hidden opacity-60 hover:opacity-100">
                    <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                </button>
            </div>
            <NavLink href="/dashboard/account">
                <svg viewBox="0 0 24 24" class="icon h-5 w-5 opacity-60">
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
                Account
            </NavLink>
            <NavLink href="/dashboard/requests">
                <svg viewBox="0 0 24 24" class="icon h-5 w-5 opacity-60">
                    <path d="M12 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M10 20h-6" /><path d="M14 20h6" /><path d="M12 15l-2 -2h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-3l-2 2z" /><path d="M9 6h6" /><path d="M9 9h3" />
                </svg>
                Requests
            </NavLink>
            <NavLink href="/dashboard/teams">
                <svg viewBox="0 0 24 24" class="icon h-5 w-5 opacity-60">
                    <path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" /><path d="M4 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 12l6 0" /><path d="M14 16l6 0" /><path d="M14 20l6 0" />
                </svg>
                Teams
            </NavLink>
            <NavLink href="/dashboard/inbox">
                <svg viewBox="0 0 24 24" class="icon h-5 w-5 opacity-60">
                    <path d="M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5" /><path d="M12 11v-8h4l2 2l-2 2h-4" /><path d="M6 15h1" />
                </svg>
                Inbox
            </NavLink>
            <NavLink href="/dashboard/deployments">
                <svg viewBox="0 0 24 24" class="icon h-5 w-5 opacity-60">
                    <path d="M13.5 21h-7.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M19 16l-2 3h4l-2 3" />
                </svg>
                Deployments
            </NavLink>
        </div>
    </nav>
    <div class="grow pt-16 md:ml-64 px-4 sm:px-8">
        <!-- <div class="sticky w-full pt-20 top-0 bg-violet-600"><slot name="top"/></div> -->
        <nav class="fixed h-7 flex flex-wrap items-center px-1 z-20 rounded-lg shadow-lg bg-slate-100 dark:bg-slate-950 border light:border-slate-200 dark:border-slate-800">
            <button class="p-1 shrink-0 opacity-60 hover:opacity-100" on:click|capture|stopPropagation={ () => showing = !showing }>
                <svg viewBox="0 0 24 24" class="icon h-5 w-5">
                    <path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" />
                </svg>
            </button>
            <PageLink href="/dashboard">
                <span class="px-1 p-0.5">
                    Dashboard
                </span>
            </PageLink>
            {#if $crumbs}
                {#each $crumbs as crumb}
                    <span>/</span>
                    <PageLink href={crumb.path}>
                        <span class="px-1.5 sm:px-1 py-1 sm:p-0.5">
                            { crumb.name }
                        </span>
                    </PageLink>
                {/each}
            {/if}
        </nav>
        <div class="pt-7"><slot/></div>
    </div>
</div>

<svelte:body on:click={ handleClick }/>