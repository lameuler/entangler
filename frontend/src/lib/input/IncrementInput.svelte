<script lang="ts">
    import TextInput from './TextInput.svelte'

    export let value: number = 0
    export let label: string | null | undefined = undefined
    export let info: string | null | undefined = undefined
    export let error: string | null | undefined = undefined
    export let disabled: boolean | null | undefined = undefined
    export let min: number = Number.MIN_SAFE_INTEGER
    export let max: number = Number.MAX_SAFE_INTEGER
    export let labelposition: 'top' | 'side' | undefined = undefined

    function preprocess(val: string, data: string|null) {
        const numeric = val.replaceAll(/[^\d]+/g, '')
        if (numeric) {
            value = Math.min(Math.max(min, parseInt(numeric)), max)
            return value.toFixed()
        } else {
            return ''
        }
    }
</script>

<div class="w-24 text-center">
    <TextInput inputmode="numeric" {preprocess} value={value.toFixed()} compact {label} {info} {error} {disabled} {labelposition}>
        <button slot="left" type="button" on:click={ () => value++ } disabled={ value>=max }
            class="p-1 -me-1 rounded-lg opacity-60 enabled:hover:opacity-100 disabled:opacity-30">
            <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
        </button>
        <button slot="right" type="button" on:click={ () => value-- } disabled={ value<=min }
            class="p-1 -ms-1 rounded-lg opacity-60 enabled:hover:opacity-100 disabled:opacity-30">
            <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M5 12l14 0" /></svg>
        </button>
    </TextInput>
</div>