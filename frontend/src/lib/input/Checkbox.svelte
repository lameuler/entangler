<script lang="ts">
    export let name: string | null | undefined = undefined
    export let id: string | null | undefined = undefined
    export let checked: boolean | null | undefined = false
</script>

<label class="flex items-center cursor-pointer select-none">
    <input class="peer w-0 h-0 opacity-0"
    {name}
    {id}
    type = 'checkbox'
    bind:checked/>
    <svg class="inline w-5 h-5 stroke-transparent peer-checked:stroke-white fill-none peer-checked:fill-violet-500" viewBox="0 0 24 24">
        <path class="stroke-2 stroke-gray-500 fill-none" d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
        <path class="stroke-0" d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" />
        <path class="fill-none" d="M5 12l5 5l10 -10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <slot/>
</label>