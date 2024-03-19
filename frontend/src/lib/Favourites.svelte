<script lang="ts">
    import Card from './Card.svelte';

    let editing = false
</script>

<Card glow=false>
    <div class="flex items-center gap-2">
        <h2 class="font-medium text-xl">
            Favourites
        </h2>
        <svg class="icon h-5 w-5 text-amber-400" viewBox="0 0 24 24">
            <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
        </svg>
        <div class="grow flex justify-end pe-0.5 gap-1 text-indigo-400">
            {#if editing}
                <button class="px-1" on:click={()=>editing=false}>Cancel</button>
                <button class="px-1" on:click={()=>editing=false}>Done</button>
            {:else}
                <button class="px-1" on:click={()=>editing=true}>Edit</button>
            {/if}
        </div>
    </div>
    <div>
        <p class="text-slate-500 mt-1">Login to save favourites</p>
    </div>
</Card>