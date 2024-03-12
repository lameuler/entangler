<script lang="ts">
    import PopUpShelf from './PopUpShelf.svelte';

    export let open: boolean = false

    const items = [
        { name: 'Bose S1 Pro', requested: 2 },
        { name: 'Prism+ TV', requested: 1 },
        { name: 'Senrun', requested: 0 },
        { name: 'Microphone With Super Long Name', requested: 0 }
    ]

    let selected = 0
</script>

<PopUpShelf bind:open title="Items">
    <div class="h-full w-full absolute flex">
        <div class="flex flex-col p-2 sm:w-56 sm:border-e border-slate-400 dark:border-slate-600 overflow-auto h-full">
            {#each items as item, i }
                <button class="flex text-start items-center justify-between rounded-lg" class:bg-violet-600={ selected===i } class:text-white={ selected===i }
                    on:click={ () => selected = i }>
                    <div class="px-3 py-2">
                        <div class="font-semibold">{item.name}</div>
                        {#if item.requested > 0}
                            <span class="text-sm opacity-80">Requested: {item.requested}</span>
                        {/if}
                    </div>
                    <svg class="icon w-6 h-6 text-slate-500 shrink-0" class:invisible={ selected===i } viewBox="0 0 24 24"><path d="M9 6l6 6l-6 6"/></svg>
                </button>
            {/each}
        </div>
        <div class="p-4 flex flex-col">
            <h2 class="text-xl font-semibold">{ items[selected].name }</h2>
            <span class="text-sm text-slate-700 dark:text-slate-300">Deploying for 24 Mar 2024 10:00AM to 1:00PM</span>
            <div class="flex mt-2 gap-1">
                <span>Count:</span>
                <div class="rounded-lg bg-gray-500/15 px-2">
                    <button>+</button>
                    <input class="text-center w-6 bg-transparent" value="2"/>
                    <button>-</button>
                </div>
                <span>/ 3 total</span>
            </div>
        </div>
    </div>
</PopUpShelf>