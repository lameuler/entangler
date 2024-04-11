<script lang="ts">
    import { request } from '$lib/api';
    import { tokenOrNullRedirect } from '$lib/auth';

    export let favourite = false
    export let favourites = 0
    export let t_id: string

    async function toggleFavourite() {
        const token = await tokenOrNullRedirect()
        if (token) {
            favourite = !favourite
            try {
                await request(fetch, '/team/'+t_id+'/favourite', token, 'POST', { favourite })
                favourites += favourite ? 1 : -1
            } catch (e) {
                
            }
        } else favourite = false
        
    }
</script>

<span class="text-gray-500 text-sm">{favourites}</span>
<button class="p-1 shrink-0 text-gray-500 hover:text-gray-600 hover:dark:text-gray-400" on:click|preventDefault={()=> toggleFavourite()}>
    {#if favourite}
    <svg class="icon h-5 w-5 text-amber-400" viewBox="0 0 24 24">
        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor" />
    </svg>
    {:else}
    <svg class="icon h-5 w-5" viewBox="0 0 24 24">
        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
    </svg>
    {/if}
</button>