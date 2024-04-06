<script lang="ts">
    import { fly } from 'svelte/transition';

    export let date: Date = new Date(2024, 3, 5)

    let showing = false
    let below = true

    let element: HTMLDivElement

    const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    let dates: Date[][] = []
    function generateDates(d: Date) {
        const start = new Date(d)
        start.setDate(1)
        start.setDate(start.getDate()-start.getDay())
        
        dates = Array(6).fill(0).map((_, i) => Array(7).fill(0).map((_, j) => {
            const dt = new Date(start)
            dt.setDate(dt.getDate() + i*7 + j)
            return dt
        }))
    }
    $: generateDates(date)
    
    function equal(d1: Date, d2: Date) {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
    }
    function set(d: Date, month?: number, year?: number) {
        const day = d.getDate()
        const changed = new Date(d)
        changed.setMonth((month ?? d.getMonth())+1)
        changed.setDate(0)
        changed.setDate(Math.min(day, changed.getDate()))
        changed.setFullYear(year ?? changed.getFullYear())
        return changed
    }
    function setShowing(s: boolean) {
        if (s !== showing) {
            if (s) {
                const rect = element.getBoundingClientRect()
                below = window.innerHeight - rect.bottom > rect.top
            }
            showing = s
        }
    }
    function outside(e: MouseEvent) {
        if(!element.contains(e.target as Node)) showing = false
    }
</script>

<div bind:this={element} class="mb-1 relative">
    <button class="px-3 py-2 bg-gray-500/15 rounded-lg" on:click={()=> setShowing(!showing)}>
        { date.toDateString() }
    </button>
    {#if showing}
    <div class="absolute text-center w-60 p-2 rounded-xl { below ? 'top-8' : 'bottom-8'} z-20 bg-gray-200/60 dark:bg-slate-700/50 backdrop-blur-xl border border-gray-300 dark:border-gray-700"
        transition:fly={{ y: below ? -20 : 20, duration: 150 }}>
        <div class="flex justify-between items-center">
            <button class="p-1" on:click={() => date = set(date, date.getMonth()-1)}>
                <svg viewBox="0 0 24 24" class="icon h-5 w-5"><path d="M15 6l-6 6l6 6" /></svg>
            </button>
            <button class="font-medium" on:click={() => date = set(date, (new Date()).getMonth(), (new Date()).getFullYear())}>
                { date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }
            </button>
            <button class="p-1" on:click={() => date = set(date, date.getMonth()+1)}>
                <svg viewBox="0 0 24 24" class="icon h-5 w-5"><path d="M9 6l6 6l-6 6" /></svg>
            </button>
        </div>
        <div class="grid grid-cols-7 text-sm py-1 opacity-75">
            {#each DAYS as day}
                <span>{day}</span>
            {/each}
        </div>
        <div class="grid grid-rows-6">
            {#each dates as week}
                <div class="grid grid-cols-7">
                    {#each week as day}
                        <button class="h-8 rounded-md {equal(day, date) ? 'font-semibold bg-violet-600 text-white' : equal(day, new Date()) ? 'font-semibold text-red-500 hover:bg-violet-500/30' : 'hover:bg-violet-500/30'}"
                            class:opacity-50={ day.getMonth() !== date.getMonth() }
                            on:click={ () => date = day }>
                            { day.getDate() }
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    </div>    
    {/if}
</div>

<svelte:body on:click={outside}/>