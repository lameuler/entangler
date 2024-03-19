<script lang="ts">
    import Search from '$lib/input/Search.svelte';
    import TeamCard from '$lib/TeamCard.svelte'
    import type { PageData } from './$types';
    
    // export let data: PageData;
</script>


<main class="pt-1">
    <div class="fixed flex justify-center w-full left-0 right-0 top-0 bg-slate-100/30 dark:bg-slate-950/50 backdrop-blur-xl">
        <div class="absolute w-full max-w-6xl px-4 sm:px-8 md:pl-72 pt-24 pb-2">
            <Search/>
        </div>
    </div>
    <div class="flex flex-col justify-stretch gap-4 pt-14">
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
        <TeamCard team={{ name: 'Hi', favourites: 0 }}></TeamCard>
    </div>
    
</main>