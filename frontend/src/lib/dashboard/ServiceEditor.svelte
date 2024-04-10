<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { invalidator, request, type Service } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Button from '$lib/input/Button.svelte';
    import OptionsInput from '$lib/input/OptionsInput.svelte';
    import TextInput from '$lib/input/TextInput.svelte';

    export let service: Service | null
    export let team: string

    let name = ''
    let description = ''
    let visible = 1
    let saving = false
    let error = ''
    let nameError = ''

    $: serviceUpdated(service)

    function serviceUpdated(s: any) {
        name = service?.service ?? ''
        description = service?.description ?? ''
        visible = (service?.visible ?? true) ? 1 : 0
    }

    async function validateName(value: string) {
        nameError = ''
        if (value && !value.match(/^\s+$/)) {
            const token = await tokenOrGoto()
            try {
                const result = await request(fetch, '/team/'+team+'/services/checkName', token, 'POST', { name: value })
                if (!result.available) {
                    nameError = 'Service with name '+value+' already exists'
                }
            } catch (e) {
                nameError = 'Could not check name'
            }
        } else {
            nameError = 'Service name cannot be blank'
        }
    }

    async function save() {
        saving = true
        if (!service) await validateName(name)
        if (nameError) {
            saving = false
            return
        }

        const token = await tokenOrGoto()
        const path = '/team/'+team+'/services'
        try {
            await request(fetch, service ? path : path+'/create', token, 'POST', { service: { service: name, description, visible } })
            
            invalidate(invalidator(path))
        } catch (e) {
            console.log(e)
        }
        saving = false
    }
</script>

{#if error}
    <ErrorAlert bind:error/>
{/if}
{#if service }
    <h2 class="text-xl font-semibold">{ service.service }</h2>
{:else}
    <h2 class="text-xl font-semibold">Create Service</h2>
    <TextInput label="Service Name" bind:value={name} validator={validateName} bind:error={nameError} disabled={saving} maxlength={50}/>
{/if}
<TextInput label="Description" bind:value={description} disabled={saving} maxlength={150}/>
<OptionsInput label="Visibility" name="vis" options={['Hidden', 'Visible']} bind:selected={visible} disabled={saving}
    info={ !visible ? 'Users submitting requests will not see this service' : undefined } />
<div class="w-fit mt-4">
    <Button on:click={save}>Save</Button>
</div>