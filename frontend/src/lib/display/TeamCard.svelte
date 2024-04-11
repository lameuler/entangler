<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { tokenOrNullRedirect } from '$lib/auth';
    import FavouritesToggle from '$lib/input/FavouritesToggle.svelte';
    import { invalidator, request, type TeamResult } from '../api';

    export let team: TeamResult
    export let base: string = '/'
    let favourite = team.fav

    const roles = ['', 'Member', 'Manager', 'Owner']

    async function toggleFavourite() {
        const token = await tokenOrNullRedirect()
        if (token) {
            favourite = !favourite
            try {
                await request(fetch, '/team/'+team.t_id+'/favourite', token, 'POST', { favourite })
                team.favourites += favourite ? 1 : -1
            } catch (e) {
                favourite = team.fav
            }
        } else favourite = false
        
    }
</script>

<a href="{base}{encodeURI(team.t_id)}" class="group p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-md">
    <div class="flex items-center gap-1">
        <h2 class="font-semibold text-xl group-hover:underline grow shrink">{team.name}</h2>
        <FavouritesToggle bind:favourite={team.fav} bind:favourites={team.favourites} t_id={team.t_id}/>
    </div>
    <div class="flex pt-1 gap-1">
        {#if team.role && typeof team.role === 'number' }
            <a class="rounded-full text-sm w-fit px-2 text-white" href="/dashboard/{encodeURI(team.t_id)}"
            class:bg-indigo-600={ team.role === 1 }
            class:bg-violet-600={ team.role === 2 }
            class:bg-purple-600={ team.role === 3 }>
                { roles[team.role] }
            </a>
        {/if}
        {#if !team.public }
            <span class="rounded-full text-sm bg-slate-300 dark:bg-slate-600 w-fit px-2">Private</span>
        {/if}
    </div>
    {#if team.description}
    <p class="text-justify text-slate-700 dark:text-slate-300 mt-1">
        { team.description }
    </p>
    {/if}
</a>