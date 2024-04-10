<script lang="ts">
    import { pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import Spinner from '$lib/Spinner.svelte';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Search from '$lib/input/Search.svelte';
    import { createEventDispatcher } from 'svelte';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import { fade, fly, scale } from 'svelte/transition';

    export let open = false
    export let search: (q?: string) => Promise<any> = async ()=>[]

    let promise = search()

    const dispatch = createEventDispatcher()

    let query = ''

    function handle(open: boolean) {
        console.log('popup', open, $page.state.popupOpen, !open === !$page.state.popupOpen)
        if (open === !$page.state.popupOpen) {
            if (open) {
                pushState('', { ...$page.state, popupOpen: true })
            } else {
                history.back()
            }
        }
    }

    function onsearch(q?: string) {
        query = q ?? ''
        promise = search(q)
    }

    $: handle(open)
</script>

{#if $page.state.popupOpen }
    <div transition:fade class="fixed inset-0 h-full w-full bg-black/50 z-50"/>
    <div class="fixed flex flex-col justify-center items-center inset-0 h-full w-full z-50">
        <main transition:scale
        class="max-w-lg w-full shrink min-h-0 max-h-96 p-2 flex flex-col bg-slate-50 dark:bg-slate-900 z-10 rounded-2xl shadow-2xl">
            <div class="px-2 pb-2 flex justify-between items-center">
                <span class="font-semibold">Find User</span>
                <button class="shrink-0 p-1 opacity-50 hover:opacity-100" on:click={ () => open = false }>
                    <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                </button>
            </div>
            <Search on:search={ ({ detail })=>onsearch(detail) } on:reset={ ()=>onsearch(undefined)}/>
            <div class="grow shrink relative flex flex-col min-h-28 bg-inherit overflow-y-auto">
                <slot/>
                {#await promise}
                    <Spinner/>
                {:then users}
                    {#if Array.isArray(users)}
                        {#each users as user}
                        <button class="text-start rounded-xl px-4 py-2 bg-gray-300/30 dark:bg-slate-700/30 mt-2"
                            on:click={ () => dispatch('add', user) }>
                            <div class="font-semibold">
                                { user.name }
                            </div>
                            <span class="text-sm opacity-60">
                                { user.email }
                            </span>
                        </button>
                        {:else}
                            <div class="flex items-center justify-center grow text-slate-700 dark:text-slate-300">
                                {#if query}
                                    No users found
                                {:else}
                                    Search for users to add to the team
                                {/if}
                            </div>
                        {/each}
                    {/if}
                {:catch err}
                    <ErrorAlert error={err.message}/>
                {/await}
            </div>
        </main>
    </div>
{/if}