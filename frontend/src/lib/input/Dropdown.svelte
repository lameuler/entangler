<script lang="ts">
    import { slide } from 'svelte/transition';

    export let options: string[]
    export let selected: number = 0
    let showing = false
    let element: HTMLDivElement

    function select(i: number) {
        selected = i
        showing = false
    }

    const handleClick = (event: MouseEvent) => {
        if (!element?.contains(event.target as Node)) showing = false
    }
</script>

<div class="h-8 w-full relative">
    <div bind:this={element} class="rounded-lg bg-slate-300/70 dark:bg-slate-700/70 backdrop-blur-md w-full absolute" class:shadow-lg={showing}>
        <button type="button" class="p-1 w-full h-8 flex items-center justify-between font-medium hover:bg-slate-400/20 rounded-lg" on:click={ () => showing = !showing }>
            <span class="px-1">{ options[selected] }</span>
            <svg viewBox="0 0 24 24" class="icon h-5 w-5">
                <!-- <path d="M6 9l6 6l6 -6" /> -->
                <path d="M8 9l4 -4l4 4" /><path d="M16 15l-4 4l-4 -4" />
            </svg>
        </button>
        {#if showing}
        <div transition:slide>
            {#each options as option, i}
                {#if i !== selected }
                    <button type="button" class="px-2 py-1 w-full h-8 text-start hover:bg-slate-400/20 rounded-lg z-50" on:click={ () => select(i) }>
                        { option }
                    </button>
                {/if}
            {/each}
        </div>
        {/if}
    </div>
</div>

<svelte:body on:click={handleClick}/>