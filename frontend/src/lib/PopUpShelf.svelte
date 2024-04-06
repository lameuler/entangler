<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { cubicOut, cubicIn, linear } from 'svelte/easing';
    import { createEventDispatcher } from 'svelte';

    export let title: string
    export let open: boolean = false
    export let close: 'self' | 'back' | 'none' = 'self'

    let top = 0

    const dispatch = createEventDispatcher<{close: undefined}>()

    function onClose() {
        if (close === 'self') open = false
        else if (close === 'back') history.back()
        dispatch('close')
    }
    function onOpen(o: boolean) {
        if (o) {
            if (!document.body.classList.contains('fixed')) {
                top = -document.documentElement.scrollTop
            }
            document.body.classList.add('fixed')
            document.body.style.top = top+'px'
        } else {
            document.body.classList.remove('fixed')
            document.documentElement.scrollTop = -top
        }
    }

    $: onOpen(open)
</script>

{#if open || close === 'none' }
    <div transition:fade class="fixed inset-0 h-full w-full bg-black/50 z-50"/>
    <div class="fixed flex flex-col justify-end items-center inset-0 h-full w-full z-50">
        <div class="grow shrink"/>
        <main in:fly|global={{ y:400, easing: cubicOut }} out:fly|global={{ y:400, easing: cubicIn }}
        class="max-w-2xl w-full grow-[2] h-96 max-h-full flex flex-col bg-slate-50 dark:bg-slate-900 z-10 rounded-t-2xl shadow-2xl">
            <div class="px-4 pt-3 pb-2 flex justify-between border-b border-slate-400 dark:border-slate-600">
                <span class="font-semibold">{title}</span>
                <button on:click={ onClose }>Done</button>
            </div>
            <div class="grow relative bg-inherit"><slot/></div>
        </main>
    </div>
{/if}