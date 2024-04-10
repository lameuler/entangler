<script lang="ts">
    import Spinner from '$lib/Spinner.svelte';
    import { encodeParam, invalidator, request } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import Member from '$lib/dashboard/Member.svelte';
    import UserSearch from '$lib/dashboard/UserSearch.svelte';
    import Button from '$lib/input/Button.svelte';
    import Search from '$lib/input/Search.svelte';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { invalidate } from '$app/navigation';
    import Fuse from 'fuse.js';
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    
    export let data: PageData;

    let open = false
    let query = ''
    let error = ''
    
    let fuse: Fuse<any> | undefined = undefined

    $: data.membersPromise?.then(items => fuse = new Fuse(items, { keys: ['name', 'email'] }))

    $: view = query ? fuse?.search(query).map(res => res.item) : undefined

    async function search(q?: string) {
        const token = await tokenOrGoto()
        return request(fetch, '/users?exclude='+data.t_id+'&q='+encodeParam(q), token).then(res => res.users)
    }
    async function addUser({ u_id }: { u_id: string }) {
        if (u_id) {
            open = false
            const token = await tokenOrGoto()
            const path = '/team/'+data.t_id+'/members'
            try {
                await request(fetch, path, token, 'POST', { members: [{ u_id, role: 1 }]})
                await invalidate(invalidator(path))
            } catch (e) {
                error = (e as Error).message ?? true
            }
        }
    }

    onMount(() => {
        search('')
    })
</script>

{#await data.membersPromise}
    <Spinner/>
{:then members}
    <ErrorAlert bind:error/>
    <div class="absolute flex flex-col h-full w-full">
        <div class="px-2 pt-2"><Search bind:value={query}/></div>
        <div class="px-2 pb-24 overflow-y-scroll">
        {#each view ?? members as member, i}
            <div class="mt-1" style="z-index: {members.length-i}">
                <Member {member} team={data.t_id}/>
            </div>
        {/each}
        </div>
        <div class="absolute bottom-4 right-4 shadow-lg" style="z-index: {members.length}">
            <Button on:click={ ()=>open=true }>Add member</Button>
        </div>
    </div>
    <UserSearch bind:open {search} on:add={ ({detail}) => addUser(detail) } />
{/await}