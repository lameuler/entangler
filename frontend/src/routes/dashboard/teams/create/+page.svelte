<script lang="ts">
    import type { Team } from '$lib/api';
    import TeamEditor from '$lib/dashboard/TeamEditor.svelte';
    
    // export let data: PageData;

    let team: Team = {
        t_id: '',
        name: '',
        public: 0
    }
</script>

<main class="h-full py-4">
    <h1 class="text-2xl font-semibold p-1">Create team</h1>
    <section>
        <TeamEditor {team}/>
    </section>
</main>

<svelte:head>
    <title>Create team | Entangler</title>
</svelte:head>