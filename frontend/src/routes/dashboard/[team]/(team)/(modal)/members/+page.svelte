<script lang="ts">
    import Spinner from '$lib/Spinner.svelte';
import Member from '$lib/dashboard/Member.svelte';
    import Button from '$lib/input/Button.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#await data.membersPromise}
    <Spinner/>
{:then members}
    <div class="absolute flex flex-col gap-2 h-full w-full overflow-y-hidden">
        <div class="p-2 pb-16 flex flex-col gap-1 overflow-y-scroll">
        {#each members as member, i}
            <div style="z-index: {members.length-i}">
                <Member {member} team={data.t_id}/>
            </div>
        {/each}
        </div>
        <div class="absolute bottom-4 right-4 z-10 shadow-lg">
            <Button>FAB</Button>
        </div>
    </div>
{/await}