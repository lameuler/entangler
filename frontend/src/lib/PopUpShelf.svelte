<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { cubicOut, cubicIn, linear } from 'svelte/easing';

    export let title: string
    export let open: boolean = false
</script>

<!-- <svelte:document> -->
{#if open}

    <div transition:fade class="fixed inset-0 h-full w-full bg-black/50 z-50"/>
    <div class="fixed flex justify-center inset-0 h-full w-full z-50">
        <main in:fly|global={{ y:400, easing: cubicOut }} out:fly|global={{ y:400, easing: cubicIn }}
        class="max-w-2xl w-full mt-20 bottom-0 flex flex-col bg-slate-50 dark:bg-slate-900 z-10 rounded-t-2xl shadow-2xl">
            <div class="px-4 pt-3 pb-2 flex justify-between border-b border-slate-400 dark:border-slate-600">
                <span class="font-semibold">{title}</span>
                <button on:click={ () => open = false}>Done</button>
            </div>
            <div class="grow relative"><slot/></div>
        </main>
    </div>
    
{/if}
<!-- </svelte:document> -->
