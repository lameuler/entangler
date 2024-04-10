<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { encodeParam, invalidator, request } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import Button from '$lib/input/Button.svelte';
    import TextInput from '$lib/input/TextInput.svelte';
    import { s } from '$lib/utils';
    import UserSearch from './UserSearch.svelte';

    export let t_id: string
    export let dep_id: string
    export let service: any

    let open = false

    $: console.log(open, service.service)

    async function save() {
        const token = await tokenOrGoto()
        const s = { service: service.service, t_id: service.t_id, members: service.deployed }
        const path = '/deployment/'+dep_id
        await request(fetch, path, token, 'POST', { deployment: { services: [s] }})
        await invalidate(invalidator(path))
    }
    function remove(member: any) {
        service.deployed = service.deployed.filter((s: any) => s!==member)
    }
    function add(user: { u_id: string, email: string, name: string }) {
        service.deployed = service.deployed.concat({ ...user, role: '' })
        open = false
    }

    async function search(q?: string) {
        const token = await tokenOrGoto()
        const result = await request(fetch, '/team/'+t_id+'/members?exclude='+dep_id+'&q='+encodeParam(q), token)
        const members: any[] = Array.isArray(result.members) ? result.members : []
        return members.filter(x=>x)
    }
</script>

<div class="flex justify-between">
    <div>
        <h2 class="text-xl font-semibold">{ service.service }</h2>
        {#if service.description}
            <p class="text-slate-700 dark:text-slate-300">{ service.description }</p>
        {/if}
    </div>
    <Button on:click={save}>Save</Button>
</div>

<p class="mb-4">{ service.requested ? 'Requested' : 'Not requested' }</p>

<div class="flex flex-wrap justify-between items-center">
    <span>{service.deployed.length} member{s(service.deployed.length)} deployed</span>
    <Button on:click={ ()=>open=true }>Add</Button>
</div>

{#each service.deployed as member}
    <div class="flex w-full gap-2 justify-center mt-2">
        <div class="grow">
            <div class="font-semibold">
                { member.name }
            </div>
            <span class="text-sm opacity-60">
                { member.email }
            </span>
        </div>
        <div class="w-36 h-min mt-1">
            <TextInput placeholder="Role" bind:value={member.role}/>
        </div>
        <button class="shrink-0 p-1 opacity-50 hover:opacity-100" on:click={ ()=>remove(member) }>
            <svg viewBox="0 0 24 24" class="icon h-6 w-6"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </button>
    </div>
{:else}
    <span class="opacity-60 mt-2">No members deployed</span>
{/each}

<UserSearch bind:open {search} on:add={ ({detail}) => add(detail)}/>