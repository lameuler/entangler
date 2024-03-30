<script lang="ts">
    import Markdown from '$lib/display/Markdown.svelte';
    import { invalidator, request, type Team } from '$lib/api';
    import TextArea from '$lib/input/TextArea.svelte';
    import TextInput from '$lib/input/TextInput.svelte';
    import OptionsInput from '$lib/input/OptionsInput.svelte';
    import Button from '$lib/input/Button.svelte';
    import { tokenOrGoto } from '$lib/auth';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import { goto, invalidate } from '$app/navigation';

    export let team: Team
    let showPreview = false
    let validatingHandle = false
    let saving = false
    let errors = 0
    let error = ''

    $: console.log(team.details)

    function validateName(value: string) {
        errors++
        if (value.match(/^\s*$/g)) {
            return { error: 'Name cannot be blank' }
        }
        errors--
        return {}
    }

    async function validateHandle(value: string) {
        validatingHandle = true
        const val: { info?: string, error?: string } = {}
        if (value.length>0) {
            errors++
            if (value.length<3 || value.length>16) {
                val.error = 'Handle must be between 3 and 20 characters long'
            } else if (!value.match(/^[A-Za-z0-9_.]+$/)) {
                val.error = 'Handle can only contain letters, numbers, periods, or underscores'
            } else {
                errors--
                const token = await tokenOrGoto()
                try {
                    const req = request(fetch, '/teams/checkHandle', token, 'POST', { handle: value, t_id: team.t_id || undefined })
                    const result = await (await req).json()
                    console.log(result)
                    if (result.handle && typeof result.available === 'boolean') {
                        if (result.available) val.info = 'Your team will be found at entang.ler.sg/@'+result.handle
                        else {
                            errors++
                            val.error = 'Handle @'+result.handle+' is taken'
                        }
                    } else val.error = 'Could not check handle'
                } catch (e) {
                    val.error = 'Error: Could not check handle'
                }
            }
        }
        validatingHandle = false
        return val
    }

    async function save() {
        if (!saving && !validatingHandle && errors === 0) {
            error = ''
            saving = true
            try {
                const token = await tokenOrGoto()
                if (team.t_id) { // update team
                    const path = '/team/'+team.t_id
                    const response = await request(fetch, '/team/'+team.t_id, token, 'POST', team)
                    const result = await (response).json()
                    if (response.status === 200) {
                        if (result.t_id === team.t_id) await invalidate(invalidator(path))
                    } else {
                        throw new Error(result.error)
                    }
                } else {
                    const response = await request(fetch, '/team/create', token, 'POST', team)
                    const result = await (response).json()
                    if (response.status === 200) {
                        if (result.t_id) await goto('/dashboard/'+result.t_id)
                    } else {
                        throw new Error(result.error)
                    }
                }
            } catch (e) {
                console.log(e)
                error = (e as Error).message
            }
            saving = false

        }
    }
</script>

{#if error}
    <div class="sticky top-2 z-50 bg-white dark:bg-black rounded-lg">
        <ErrorAlert {error} type="warning"/>
    </div>
{/if}
<TextInput label="Team Name" placeholder="Team Name" bind:value={team.name} maxlength={50} validator={validateName} disabled={saving}/>
<TextInput label="Handle" placeholder="handle" bind:value={team.handle} maxlength={20} spellcheck="false"
    validator={validateHandle} disabled={saving}/>
<OptionsInput label="Visibility" name="visibility" options={['Private', 'Public']} bind:selected={team.public} disabled={saving}/>
<TextArea label="Description" placeholder="Description" maxlength={150} bind:value={team.description} compact disabled={saving}/>
<TextArea label="Details" placeholder="Details" maxlength={1000} bind:value={team.details} disabled={saving}>
    <span slot="desc">
        Markdown formatting is supported.
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
<div class="mt-4"><Button on:click={save}>Save team</Button></div>