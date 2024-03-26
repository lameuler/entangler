<script lang="ts">
    export let label: string | null | undefined = undefined
    export let error: string | null | undefined = undefined
    export let info: string | null | undefined = undefined
    export let disabled: boolean | null | undefined = undefined
</script>

<div class:opacity-60={disabled}>
    {#if label}
        <div class="font-medium px-2 py-1">{label}</div>
    {/if}
    <slot/>
    {#if error}
    <div class="text-sm text-red-500 px-2 pt-1 -mb-2">{error}</div>
    {:else if info}
    <div class="text-sm text-slate-500 px-2 pt-1 -mb-2">{info}</div>
    {/if}
</div>