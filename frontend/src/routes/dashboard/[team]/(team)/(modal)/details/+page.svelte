<script lang="ts">
    import ErrorAlert from '$lib/display/ErrorAlert.svelte';
    import Markdown from '$lib/display/Markdown.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import TeamEditor from '$lib/dashboard/TeamEditor.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#await data.teamPromise}
    <Spinner/>
{:then team}
    <main class="p-4 absolute h-full w-full overflow-y-auto">
        <TeamEditor {team}/>
    </main>
{:catch err}
    <ErrorAlert/>
{/await}