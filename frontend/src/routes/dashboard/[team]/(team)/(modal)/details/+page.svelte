<script lang="ts">
    import Markdown from '$lib/Markdown.svelte';
    import Spinner from '$lib/Spinner.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#await data.teamPromise}
    <Spinner/>
{:then team}
    <div class="p-4">
        <Markdown markdown={ team.details }/>
    </div>
{/await}