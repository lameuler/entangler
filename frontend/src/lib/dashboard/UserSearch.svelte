<script lang="ts">
    import { pushState } from '$app/navigation';
    import { page } from '$app/stores';
    import Search from '$lib/input/Search.svelte';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import { fade, fly, scale } from 'svelte/transition';

    export let open = false
    export let search: (q?: string) => any = ()=>{}

    function handle(open: boolean) {
        console.log('popup', open, $page.state.popupOpen, !open === !$page.state.popupOpen)
        if (open === !$page.state.popupOpen) {
            if (open) {
                pushState('', { popupOpen: true })
            } else {
                history.back()
            }
        }
    }

    $: handle(open)
</script>

{#if $page.state.popupOpen }
    <div transition:fade class="fixed inset-0 h-full w-full bg-black/50 z-50"/>
    <div class="fixed flex flex-col justify-center items-center inset-0 h-full w-full z-50">
        <main transition:scale
        class="max-w-lg w-full max-h-96 p-2 flex flex-col bg-slate-50 dark:bg-slate-900 z-10 rounded-2xl shadow-2xl">
            <div class="px-2 pb-2 flex justify-between items-center">
                <span class="font-semibold">Find User</span>
                <button class="shrink-0 p-1 opacity-50 hover:opacity-100" on:click={ () => open = false }>
                    <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                </button>
            </div>
            <Search on:search={ ({ detail })=>search(detail) } on:reset={ ()=>search(undefined)}/>
            <div class="grow shrink relative bg-inherit overflow-y-auto">
                <slot/>
            </div>
        </main>
    </div>
{/if}