<script lang="ts">
    import { page } from '$app/stores';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Markdown from '$lib/display/Markdown.svelte';
    import PageSpinner from '$lib/PageSpinner.svelte';
    import PopUpShelf from '$lib/PopUpShelf.svelte';
    import Button from '$lib/input/Button.svelte';
    import type { PageData } from './$types';
    import TextInput from '$lib/input/TextInput.svelte';
    import TextArea from '$lib/input/TextArea.svelte';
    import DateRangeInput from '$lib/input/DateRangeInput.svelte';
    import Card from '$lib/Card.svelte';
    import IncrementInput from '$lib/input/IncrementInput.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import Checkbox from '$lib/input/Checkbox.svelte';
    import { request } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import Error from '../../dashboard/[team]/+error.svelte';
    import { goto } from '$app/navigation';
    
    export let data: PageData;

    let open = false
    let error = ''

    let name = ''
    let nameError = ''
    let description = ''
    let committee = ''
    let dates: { start: Date, end: Date, description: string }[] = []
    let dupDates: number[] = []
    let saving = false

    $: clearDup(dates)

    let itemReqs: { [item: string]: number } = {}
    let serviceReqs: { [service: string]: boolean } = {}

    $: data.itemsPromise.then(initItems)
    $: data.servicesPromise.then(initServices)

    function validateName() {
        if (name.match(/^\s$/)) nameError = 'Name cannot be blank'
    }
    function visible(array: any[]) {
        return array.filter(a => a.visible)
    }
    function initItems(items: { item: string }[]) {
        itemReqs = {}
        items.forEach(i => itemReqs[i.item] = 0)
    }
    function initServices(services: { service: string }[]) {
        serviceReqs = {}
        services.forEach(s => serviceReqs[s.service] = false)
    }
    function validateDates(dates: { start: Date, end: Date, description: string }[]) {
        dupDates = []
        dates.forEach((date,i) => {
            dates.slice(0,i).forEach(d => {
                if (date.start.getTime() === d.start.getTime() && date.end.getTime() === d.end.getTime() && date.description.trim().toLowerCase() === d.description.trim().toLowerCase()) {
                    dupDates.push(i)
                }
            })
        })
    }
    function clearDup(d: any) {
        dupDates = []
    }
    function roundDate(offset: number = 0) {
        const date = new Date()
        date.setMinutes(Math.ceil((date.getMinutes()+offset)/30)*30)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
    }

    $: validateDates(dates)

    async function submit() {
        saving = true
        validateName()
        validateDates(dates)
        if (!nameError && dupDates.length === 0) {
            const token = await tokenOrGoto()
            const req = {
                name, description, committee,
                dates,
                items: Object.keys(itemReqs).map(i => itemReqs[i] > 0 ? { item: i, count: itemReqs[i] } : undefined).filter(i=>i),
                services: Object.keys(serviceReqs).map(s => serviceReqs[s] ? { service: s } : undefined).filter(s=>s)
            }
            try {
                const response = await request(fetch, '/team/'+data.t_id+'/request', token, 'POST', { request: req })
                const result = await response.json()
                if (response.status === 200) {
                    await goto('/dashboard/requests')
                } else if (response.status === 400) {
                    nameError = result.error
                } else {
                    throw new Error(result.error)
                }
            } catch (err) {
                error = (err as any).message
            }
        }
        saving = false
    }

</script>

<main class="p-4 sm:p-10 pt-20 gap-6 h-full">
    {#await data.teamPromise }
        <PageSpinner/>
    {:then team }
        {#if team }
            <section id="request" class="mt-8 mb-4">
                {#if error}
                    <ErrorAlert {error}/>
                {/if}
                <a href="/{$page.params.team}" class="text-lg font-medium hover:underline">{ team.name }</a>
                <h1 class="text-3xl font-semibold">New Request</h1>
                <p class="my-2 text-justify text-slate-700 dark:text-slate-300">
                    { team.description }
                </p>
                {#if team.details }
                <Button on:click={ () => open = true }>
                    Show details
                </Button>
                <PopUpShelf title="Details" bind:open>
                    <div class="p-4">
                        <Markdown markdown={ team.details }/>
                    </div>
                </PopUpShelf>
                {/if}
            </section>
            <section id="overview" class="mb-4">
                <h2 class="text-2xl font-semibold mb-2">
                    Overview
                </h2>
                <TextInput bind:value={name} label="Event Name" maxlength={50} validator={validateName} bind:error={nameError} disabled={saving}/>
                <TextArea bind:value={description} label="Description" maxlength={500} disabled={saving}/>
                <TextInput bind:value={committee} label="Committee/Class" maxlength={50} disabled={saving}/>
            </section>
            <section id="overview" class="mb-4 flex flex-col gap-2">
                <h2 class="text-2xl font-semibold">
                    Dates
                </h2>
                {#each dates as d, i}
                <Card glow="false">
                    <div class="flex items-start justify-between px-2 gap-2">
                        <DateRangeInput bind:start={d.start} bind:end={d.end}/>
                        <button class="shrink-0 p-1 opacity-50 hover:opacity-100" on:click={ ()=>dates = dates.filter(dt => dt !== d) }>
                            <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <TextInput label="Description" maxlength={150} bind:value={d.description} disabled={saving}/>
                    {#if dupDates.includes(i)}
                        <span class="text-sm text-red-500">Duplicate date: Please change the dates or description</span>
                    {/if}
                </Card>
                {/each}
                <Button on:click={() => dates = dates.concat({ start: roundDate(), end: roundDate(60), description: ''})} fit disabled={saving}>
                    Add Date
                </Button>
            </section>
            {#await Promise.all([data.itemsPromise, data.servicesPromise])}
                <Spinner/>
            {:then [items, services]}
                {#if items && visible(items).length > 0}
                <section id="overview" class="mb-4">
                    <h2 class="text-2xl font-semibold">
                        Items
                    </h2>
                    {#each visible(items) as item}
                        <div class="flex justify-between p-1 my-1">
                            <div>
                                <span class="font-medium">
                                    { item.item }
                                </span>
                                {#if item.description }
                                    <p class="text-sm opacity-80">{ item.description }</p>
                                {/if}
                            </div>
                            <IncrementInput min={0} max={item.count} bind:value={itemReqs[item.item]} disabled={saving}/>
                        </div>
                    {/each}
                </section>
                {/if}
                {#if services && visible(services).length > 0}
                <section id="overview" class="mb-4">
                    <h2 class="text-2xl font-semibold">
                        Services
                    </h2>
                    {#each visible(services) as service}
                        <div class="m-1">
                            <Checkbox bind:checked={serviceReqs[service.service]}>
                                <div class="p-1">
                                    <span class="font-medium">{service.service}</span>
                                    {#if service.description }
                                        <p class="text-sm opacity-80">{ service.description }</p>
                                    {/if}
                                </div>
                            </Checkbox>
                        </div>
                    {/each}
                </section>
                {/if}
            {/await}
            <Button disabled={ !!(saving || nameError || dupDates.length) } on:click={submit}>Submit</Button>
            {#if nameError || dupDates.length}
                <div class="text-red-500 mt-2">Please check that all fields are entered correctly</div>
            {/if}
        {:else}
            <ErrorAlert/>
        {/if}
    {:catch err}
        {#if err?.status === 404 }
            <div>Team not found</div>
        {:else}
            <ErrorAlert/>
        {/if}
    {/await}
</main>