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
    
    export let data: PageData;

    let open = false
    let promise: Promise<any[]> = Promise.resolve([])
    let query = ''
    let addquery = ''
    
    let fuse: Fuse<any> | undefined = undefined

    $: data.membersPromise.then(items => fuse = new Fuse(items, { keys: ['name', 'email'] }))

    $: view = query ? fuse?.search(query).map(res => res.item) : undefined

    async function search(q?: string) {
        addquery = q ?? ''
        const token = await tokenOrGoto()
        promise = request(fetch, '/users?exclude='+data.t_id+'&q='+encodeParam(q), token).then(res => res.json()).then(res => Array.isArray(res.users) ? res.users : [])
    }
    async function addUser(u_id: string) {
        if (u_id) {
            open = false
            const token = await tokenOrGoto()
            const path = '/team/'+data.t_id+'/members'
            await request(fetch, path, token, 'POST', { members: [{ u_id, role: 1 }]})
            await invalidate(invalidator(path))
        }
    }

    onMount(() => {
        search('')
    })
</script>

{#await data.membersPromise}
    <Spinner/>
{:then members}
    <div class="absolute flex flex-col h-full w-full">
        <div class="px-2 pt-2"><Search bind:value={query}/></div>
        <div class="px-2 pb-24 overflow-y-scroll">
        {#each view ?? members as member, i}
            <div class="mt-1" style="z-index: {members.length-i}">
                <Member {member} team={data.t_id}/>
            </div>
        {/each}
        </div>
        <div class="absolute bottom-4 right-4 z-10 shadow-lg">
            <Button on:click={ ()=>open=true }>Add member</Button>
        </div>
    </div>
    <UserSearch bind:open {search}>
        <div class="flex flex-col min-h-28">
            {#await promise}
                <Spinner/>
            {:then users}
                {#if Array.isArray(users)}
                    {#each users as user}
                    <button class="text-start rounded-xl px-4 py-2 bg-gray-300/30 dark:bg-slate-700/30 mt-2"
                        on:click={ () => addUser(user.u_id)}>
                        <div class="font-semibold">
                            { user.name }
                        </div>
                        <span class="text-sm opacity-60">
                            { user.email }
                        </span>
                    </button>
                    {:else}
                        <div class="flex items-center justify-center grow text-slate-700 dark:text-slate-300">
                            {#if addquery}
                                No users found
                            {:else}
                                Search for users to add to the team
                            {/if}
                        </div>
                    {/each}
                {/if}
            {/await}
        </div>
    </UserSearch>
{/await}