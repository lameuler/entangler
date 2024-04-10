<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { request, type Item, invalidator } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Button from '$lib/input/Button.svelte';
    import IncrementInput from '$lib/input/IncrementInput.svelte';
    import OptionsInput from '$lib/input/OptionsInput.svelte';
    import TextInput from '$lib/input/TextInput.svelte';

    export let item: Item | null
    export let team: string

    let name = ''
    let description = ''
    let count = 0
    let visible = 1
    let saving = false
    let error = ''
    let nameError = ''

    $: itemUpdated(item)

    function itemUpdated(i: any) {
        name = item?.item ?? ''
        description = item?.description ?? ''
        count = item?.count ?? 0
        visible = (item?.visible ?? true) ? 1 : 0
    }

    async function validateName(value: string) {
        nameError = ''
        if (value && !value.match(/^\s+$/)) {
            const token = await tokenOrGoto()
            try {
                const result = await request(fetch, '/team/'+team+'/items/checkName', token, 'POST', { name: value })
                if (!result.available) {
                    nameError = 'Item with name '+value+' already exists'
                }
            } catch (e) {
                nameError = 'Could not check name'
            }
        } else {
            nameError = 'Item name cannot be blank'
        }
    }

    async function save() {
        saving = true
        if (!item) await validateName(name)
        if (nameError) return

        const token = await tokenOrGoto()
        const path = '/team/'+team+'/items'
        try {
            await request(fetch, item ? path : path+'/create', token, 'POST', { item: { item: name, description, count, visible } })
            
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
{#if item }
    <h2 class="text-xl font-semibold">{ item.item }</h2>
{:else}
    <h2 class="text-xl font-semibold">Create Item</h2>
    <TextInput label="Item Name" bind:value={name} validator={validateName} bind:error={nameError} disabled={saving}/>
{/if}
<TextInput label="Description" bind:value={description} disabled={saving}/>
<IncrementInput label="Total count:" min={0} max={999} bind:value={count} labelposition="side" disabled={saving}/>
<OptionsInput label="Visibility" name="vis" options={['Hidden', 'Visible']} bind:selected={visible} disabled={saving}
    info={ !visible ? 'Users submitting requests will not see this item' : undefined } />
<div class="w-fit mt-4">
    <Button on:click={save}>Save</Button>
</div>