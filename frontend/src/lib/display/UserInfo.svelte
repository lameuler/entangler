<script lang="ts">
    import ErrorAlert from './ErrorAlert.svelte';
    import type { User } from '../api';

    export let user: Promise<User | null>
</script>

<div class="flex flex-col">
    {#await user}
        <span class="w-7/12 bg-gray-400 dark:bg-gray-600 animate-pulse h-5 rounded-md my-0.5"></span>
        <span class="text-sm w-10/12 bg-gray-300 dark:bg-gray-700 animate-pulse h-4 rounded-md my-0.5"></span>
    {:then result}
        {#if result }
        <span class="font-semibold overflow-hidden text-ellipsis">{ result.name }</span>
        <span class="text-sm opacity-75 overflow-hidden text-ellipsis">{ result.email }</span>
        {:else}
            <ErrorAlert error="Error"/>
        {/if}
    {:catch}
        <ErrorAlert error="Error"/>
    {/await}
</div>