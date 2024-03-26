<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import InputBase from './InputBase.svelte';

    export let label: string | null | undefined = undefined
    export let type: 'text' | 'password' | 'email' | 'url' | null | undefined = undefined
    export let placeholder: string | null | undefined = undefined
    export let error: string | null | undefined = undefined
    export let info: string | null | undefined = undefined
    export let maxlength: number | null | undefined = undefined
    export let spellcheck: boolean | "true" | "false" | null | undefined = undefined
    export let disabled: boolean | null | undefined = undefined
    export let value: string = ''

    export let validator: ((value: string) => { 
        info?: string | null, 
        error?: string | null
    }) | undefined = undefined
    export let validateAfter: number | null | undefined = 500

    let input: HTMLInputElement
    $: input && (input.value = value)
    let override = false

    let timeout = -1

    const dispatch = createEventDispatcher<{ submit: string }>()

    function onInput() {
        value = input.value
        clearTimeout(timeout)
        if (typeof validateAfter === 'number' && isFinite(validateAfter) && validateAfter>=0) {
            validate(false)
            timeout = setTimeout(validate, validateAfter)
        }
    }

    function validate(setError: boolean = true) {
        clearTimeout(timeout)
        if (validator) {
            const result = validator(value)
            if (result.error) {
                if(setError) error = result.error
                info = undefined
            } else if (result.info) {
                error = undefined
                info = result.info
            } else {
                error = undefined
                info = undefined
            }
        }
    }
</script>

<InputBase {label} {info} {error} {disabled}>
    <form on:submit|preventDefault={ () => { validate(); dispatch('submit', value) } }
        class="flex relative items-center bg-gray-500/15 rounded-lg w-full focus-within:ring-2 ring-indigo-500">
        <slot name="left"/>
        <input class="bg-transparent flex-grow px-3 py-2 outline-none min-w-0 disabled:cursor-not-allowed"
            {placeholder}
            type={ override ? 'text' : type}
            maxlength={ maxlength !== undefined && maxlength !== null && maxlength >= 0 ? Math.floor(maxlength) : undefined }
            {spellcheck}
            {disabled}
            on:input={ onInput }
            on:focusout={ () => validate() }
            bind:this={input}/>
            {#if maxlength !== undefined && maxlength !== null && maxlength >= 0}
            <span class="pr-2 opacity-50">{Math.floor(maxlength - value.length)}</span>
        {/if}
        {#if type === 'password'}
            <button class="pr-3" on:click={() => override = !override}>
                {#if override}
                <svg class="icon h-6 w-6 opacity-60 hover:opacity-80" viewBox="0 0 24 24">
                    <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                    <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                    <path d="M3 3l18 18" />
                </svg>
                {:else}
                <svg class="icon h-6 w-6 opacity-60 hover:opacity-80" viewBox="0 0 24 24">
                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                </svg>
                {/if}
            </button>
        {/if}
        <slot name="right"/>
    </form>
</InputBase>