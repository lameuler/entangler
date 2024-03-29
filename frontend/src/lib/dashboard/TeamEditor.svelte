<script lang="ts">
    import Markdown from '$lib/Markdown.svelte';
    import type { Team } from '$lib/api';
    import TextArea from '$lib/input/TextArea.svelte';
    import TextInput from '$lib/input/TextInput.svelte';
    import OptionsInput from '$lib/input/OptionsInput.svelte';

    export let team: Team
    let showPreview = false

    $: console.log(team.details)

    async function validateHandle(value: string) {
        const val: { info?: string, error?: string } = {}
        if (value.length >=3 && value.length <= 16) {
            val.info = 'Your team will be found at entang.ler.sg/@'+value.toLowerCase()
        } else {
            val.error = 'Handle must be between 3 and 16 characters long'
        }
        return val
    }
</script>

<TextInput label="Team Name" placeholder="Team Name" value={team.name} maxlength={50}/>
<TextInput label="Handle" placeholder="handle" value={team.handle} maxlength={50} spellcheck="false"
    validator={validateHandle}/>
<OptionsInput label="Visibility" name="visibility" options={['Private', 'Public']} bind:selected={team.public}/>
<TextArea label="Description" placeholder="Description" maxlength={150} bind:value={team.description} compact/>
<TextArea label="Details" placeholder="Details" maxlength={1000} bind:value={team.details}>
    <span slot="desc">
        Markdown syntax is supported.
        <button on:click={()=>showPreview=!showPreview} class="text-violet-600 dark:text-violet-400 underline">
            {#if showPreview}Hide{:else}Show{/if} preview
        </button>
    </span>
</TextArea>
{#if showPreview}
    <span class="font-medium px-2 mt-1">Preview</span>
    <div class="p-4 bg-gray-500/15 rounded-lg min-h-32 max-h-48 overflow-y-auto">
        <Markdown bind:markdown={ team.details }/>
    </div>
{/if}