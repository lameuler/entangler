<script lang="ts">
    import InputBase from './InputBase.svelte';

    export let label: string | null | undefined = undefined
    export let placeholder: string | null | undefined = undefined
    export let error: string | null | undefined = undefined
    export let info: string | null | undefined = undefined
    export let maxlength: number | null | undefined = undefined
    export let spellcheck: boolean | "true" | "false" | null | undefined = undefined
    export let disabled: boolean | null | undefined = undefined
    export let value: string | null | undefined = undefined
    export let compact: boolean = false
</script>
<InputBase {label} {error} {info} {disabled}>
    <slot name="desc" slot="desc"/>
    <div class="bg-gray-500/15 rounded-lg w-full focus-within:ring-2 ring-indigo-500 { compact ? 'h-16':'h-32'} relative">
        <textarea class="bg-transparent rounded-md block w-full h-full px-3 py-2 m-0 min-h-16 outline-none resize-none disabled:cursor-not-allowed overflow-x-hidden overflow-y-auto"
        bind:value 
        {placeholder} {spellcheck} {disabled} {maxlength}
        />
        {#if typeof value === 'string' && maxlength}
            <span class="absolute end-2 bottom-0.5 text-sm opacity-50">{value.length} / {Math.floor(maxlength)}</span>
        {/if}
    </div>
</InputBase>