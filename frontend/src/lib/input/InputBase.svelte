<script lang="ts">
    export let label: string | null | undefined = undefined
    export let error: string | null | undefined = undefined
    export let info: string | null | undefined = undefined
    export let disabled: boolean | null | undefined = undefined
    export let labelposition: 'top' | 'side' = 'top'
</script>

<div class:opacity-60={disabled} class="block mb-1">
    <div class={ labelposition === 'top' ? 'contents' : 'flex'}>
        {#if label}
            <div class="font-medium px-2 py-1 text-nowrap text-start">{label}</div>
        {/if}
        {#if labelposition === 'top'}
            <div class="text-sm text-start text-slate-500 px-2 -mt-1 mb-1"><slot name="desc"/></div>
        {/if}
        <slot/>
    </div>
    {#if error}
        <div class="text-sm text-start text-red-500 px-2 pt-1 -mb-1">{error}</div>
    {:else if info}
        <div class="text-sm text-start text-slate-500 px-2 pt-1 -mb-1">{info}</div>
    {/if}
</div>