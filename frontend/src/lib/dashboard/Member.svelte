<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { invalidator, request } from '$lib/api';
    import { tokenOrGoto } from '$lib/auth';
    import Dropdown from '$lib/input/Dropdown.svelte';

    export let team: string
    export let member: { u_id: string, name: string, email: string, role: number }

    let selected = 1

    const memberUpdate = (m: any) => selected = member.role

    $: memberUpdate(member)

    async function update(selected: number) {
        if (selected != member.role) {
            const path = '/team/'+team+'/members'
            const token = await tokenOrGoto()
            await request(fetch, path, token, 'POST', { members: [{ u_id: member.u_id, role: selected }] })
            invalidate(invalidator(path))
        }
    }

    $: update(selected)
</script>
<div class="flex flex-wrap justify-between items-center rounded-xl px-4 py-2 bg-gray-300/30 dark:bg-slate-700/30 z-[inherit]">
    <div>
        <div class="font-semibold">
            { member.name }
        </div>
        <span class="text-sm opacity-60">
            { member.email }
        </span>
    </div>
    <div class="w-32 z-[inherit]">
        {#if member.role > 2}
            <span class="px-2 font-medium">Owner</span>
        {:else}
            <Dropdown options={['Remove', 'Member', 'Manager']} bind:selected/>
        {/if}
    </div>
</div>