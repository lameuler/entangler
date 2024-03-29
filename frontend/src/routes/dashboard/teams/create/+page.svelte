<script lang="ts">
    import type { Team } from '$lib/api';
    import TeamEditor from '$lib/dashboard/TeamEditor.svelte';
import OptionsInput from '$lib/input/OptionsInput.svelte';
    import TextInput from '$lib/input/TextInput.svelte';
    import type { PageData } from './$types';
    
    // export let data: PageData;

    let team: Team = {
        t_id: '',
        name: '',
        handle: '',
        description: '',
        details: '',
        fav: false,
        role: 3,
        public: 0,
        favourites: 0
    }
</script>

<main class="h-full py-4">
    <h1 class="text-2xl font-semibold p-1">Create team</h1>
    <section>
        <TeamEditor {team}/>
    </section>
</main>