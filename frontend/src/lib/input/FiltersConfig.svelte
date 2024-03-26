<script lang="ts">
    import Checkbox from '$lib/input/Checkbox.svelte';
    import Dropdown from '$lib/input/Dropdown.svelte';
    import { onMount } from 'svelte';
    import Button from './Button.svelte';

    let checked = [false, false, false]
    let selected = [0,0]
    export let filter = ''

    export let options: string[][] = []

    update()
    updateFilter()

    $: update(filter, options)
    $: updateFilter(checked, selected, options)

    function updateFilter(...dep: any[]) {
        let filters = []
        if (checked[0]) filters.push(options[0][selected[0]])
        if (checked[1]) filters.push(options[1][selected[1]])
        if (checked[2]) filters.push('favourites')

        filter = filters.join(',').toLowerCase()
        console.log('filter:config', filter)
    }

    function update(...dep: any[]) {
        const filters = filter.toLowerCase().split(',')
        options.forEach((opts, i) => {
            opts.forEach((opt, s) => {
                if (filters.includes(opt.toLowerCase())) {
                    checked[i] = true
                    selected[i] = s
                }
            })
        })
    }

    function clear() {
        for (let i=0; i<checked.length; i++) checked[i] = false
    }

</script>

<div class="w-48 flex flex-col gap-1">
    <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg px-1">Filters</h3>
        <button class="px-1 text-violet-600 dark:text-violet-400" on:click={ clear }>
            Clear
        </button>
    </div>
    {#each options as opts, i}
        {#if opts.length > 1}
        <div class="flex gap-1" style="z-index: {options.length-i};">
            <Checkbox bind:checked={checked[i]}/>
            <Dropdown options={opts} bind:selected={selected[i]}/>
        </div>
        {:else if opts.length === 1}
        <Checkbox bind:checked={checked[i]}>
            <span class="px-2 py-1 font-medium">{opts[0]}</span>
        </Checkbox>
        {/if}
    {/each}
    <Button type="submit">Apply</Button>
</div>