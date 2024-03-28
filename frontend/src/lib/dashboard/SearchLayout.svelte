<script lang="ts">

    import FiltersConfig from '$lib/input/FiltersConfig.svelte';
import Search from '$lib/input/Search.svelte';
    export let q = ''
    export let filter = ''
    export let options: string[][]
    export let search: (q?: string, filter?: string) => any = ()=>{}
</script>
<main class="pt-1">
    <div class="fixed z-10 flex justify-center w-full left-0 right-0 top-0 bg-slate-100/30 dark:bg-slate-950/50 backdrop-blur-xl">
        <div class="w-full max-w-6xl px-4 sm:px-8 md:pl-72 pt-24 pb-2">
            <Search value={ q?.split('+').map(decodeURIComponent).join(' ') ?? '' } on:search={ ({ detail })=>search(detail, filter) } on:reset={ ()=>search(undefined, filter)}>
                <FiltersConfig slot="config" {options} bind:filter/>
            </Search>
        </div>
    </div>
    <div class="flex flex-col justify-stretch gap-4 pt-14">
        <slot/>
    </div>
</main>