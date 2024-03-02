<script lang="ts">
    export let name: string
    export let options: string[]
    export let label: string | null | undefined = undefined
    export let type: 'radio' | 'checkbox' | null | undefined = undefined
    export let error: string | null | undefined = undefined
    export let info: string | null | undefined = undefined
    // export let onInput: ((e: Event, target: HTMLInputElement) => any) | undefined = undefined
    export let value: string = ''
    let input: HTMLInputElement
</script>

<div>
    {#if label}
        <div class="font-medium px-2 py-1">{label}</div>
    {/if}
    
    {#each options as option}
        <label class="flex items-center px-2">
            <input class="peer w-0 h-0 opacity-0"
            {name}
            id={option}
            type = {type ?? 'radio'}
            on:input={e => {value = input.value; console.log(value)}}
            bind:this={input}/>
            <svg class="inline w-5 h-5 stroke-gray-500 peer-checked:stroke-violet-500 fill-none peer-checked:fill-violet-500" viewBox="-9 -9 18 18">
                <circle class="stroke-2 fill-none" x="0" y="0" r="8"/>
                <circle class="stroke-0" x="0" y="0" r="4"/>
            </svg>
            <span class="px-2 py-1">{option}</span>
        </label>
    {/each}
        
    {#if error}
    <div class="text-sm text-red-500 px-2 pt-1 -mb-2">{error}</div>
    {:else if info}
    <div class="text-sm text-slate-500 px-2 pt-1 -mb-2">{info}</div>
    {/if}
</div>